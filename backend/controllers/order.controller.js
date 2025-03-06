import Order from "../models/order.js";
import Address from "../models/Address.js";
import Payment from "../models/payment.js";
import { createShiprocketOrder } from "../utils/shiprocket-service/shiprocket.js";

const handleOrderNotFound = (res) => {
  return res.status(404).json({ message: "Order not found" });
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderData, selectedAddressID, paymentOrderId } = req.body;

    const address = await Address.findOne({ _id: selectedAddressID, userId });
    if (!address) {
      return res.status(400).json({ error: "Invalid shipping address" });
    }

    const payment = await Payment.findOne({ paymentOrderId, userId });
    if (!payment || payment.status !== "COMPLETED") {
      return res.status(400).json({ error: "Invalid or incomplete payment" });
    }

    const shippingCost = orderData.products.shippingCost || 0;
    const totalAmount = orderData.products.total; 
    const discountAmount = orderData.products.totalDiscount || 0;

    const shiprocketResponse = await createShiprocketOrder(orderData);
    if (!shiprocketResponse || !shiprocketResponse.order_id) {
      return res.status(500).json({ error: "Shiprocket order creation failed" });
    }

    const newOrder = await Order.create({
      userId,
      products: orderData.products.items,
      totalMRP: orderData.products.totalMRP,
      discountAmount: discountAmount,
      shippingCost: shippingCost,
      donationAmount: orderData.products.donationAmount || 0,
      totalAmount: totalAmount,
      orderStatus: "Processing",
      shippingAddress: address, 
      billingAddress: orderData.billingAddress || address,
      shippingMethod: orderData.shippingMethod || "Standard",
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      isPaid: true,
      paidAt: new Date(),
      shiprocketOrderId: shiprocketResponse.order_id,
      trackingId: shiprocketResponse.tracking_id || null,
      courierName: shiprocketResponse.courier_name || null,
      estimatedDelivery: shiprocketResponse.estimated_delivery_date || null,
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
      notes: orderData.notes || "",
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("❌ Order Creation Error:", error);
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

    if (!updatedOrder) return handleOrderNotFound(res);

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Order ID is required" });

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) return handleOrderNotFound(res);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
