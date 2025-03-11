import Order from "../models/order.js";
import Address from "../models/Address.js";
import Payment from "../models/payment.js";
import {
  createShiprocketOrder,
  cancelShiprocketOrder,
  ReturnShiprocketOrder,
} from "../utils/shiprocket-service/shiprocket.js";
import Product from "../models/product.js";

const handleOrderNotFound = (res) => {
  return res.status(404).json({ message: "Order not found" });
};

export const createOrder = async (req, res) => {
  try {
    const { loginId, _id } = req.user;
    const { paymentOrderId } = req.body;
    const userId = _id;

    const payment = await Payment.findOne({ paymentOrderId, userId });
    if (!payment || payment.status !== "COMPLETED") {
      return res.status(400).json({ error: "Invalid or incomplete payment" });
    }

    const productIds = payment.productIds;
    const productsData = await Product.find({ _id: { $in: productIds } });

    if (productsData.length !== productIds.length) {
      return res.status(400).json({ error: "Invalid product(s) in payment" });
    }

    const products = productsData.map((product) => ({
      productId: product._id,
      name: product.name,
      quantity: product.quantity, 
      price: product.price,
      totalPrice: product.price,
    }));
    const addressId = payment.addressId;
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) {
      return res.status(400).json({ error: "Invalid shipping address" });
    }

    const pickupDetails = await getShiprocketPickupLocations();
    const payload = {
      userId,
      email: loginId,
      products,
      address,
      payment,
      pickupAddress: pickupDetails?.data?.shipping_address[0],
    };

    const shiprocketResponse = await createShiprocketOrder(payload);
    if (!shiprocketResponse || !shiprocketResponse.order_id) {
      return res
        .status(500)
        .json({ error: "Shiprocket order creation failed" });
    }

    const newOrder = await Order.create({
      orderId: payment.paymentOrderId,
      userId,
      products,
      totalMRP: payment.totalMRP,
      discountAmount: payment.totalDiscount,
      shippingCost: 0,
      donationAmount: payment.donationAmounts || 0,
      totalAmount: payment.amount,
      orderStatus: "Processing",
      shippingAddress: {
        fullName: address.fullName,
        phone: address.mobileNumber,
        addressLine1: address.address,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        postalCode: address.pincode,
        country: address.country || "India",
      },
      billingAddress: {
        fullName: address.fullName,
        phone: address.mobileNumber,
        addressLine1: address.address,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        postalCode: address.pincode,
        country: address.country || "India",
      },
      shippingMethod: "Standard",
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || null,
      isPaid: true,
      paidAt: new Date(),
      shiprocketOrderId: shiprocketResponse.order_id,
      trackingId: shiprocketResponse.tracking_id || null,
      courierName: shiprocketResponse.courier_name || null,
      estimatedDelivery: shiprocketResponse.estimated_delivery_date || null,
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const order = await Order.findById(id);

    if (!order) return handleOrderNotFound(res);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const returnOrder = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );
    const response = await ReturnShiprocketOrder(payload);

    if (!updatedOrder) return handleOrderNotFound(res);

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const response = await cancelShiprocketOrder(id);
    const deletedOrder = await Order.findByIdAndUpdate(id, {
      orderStatus: status,
    });

    if (!deletedOrder) return handleOrderNotFound(res);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
