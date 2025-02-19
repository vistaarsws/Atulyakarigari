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

    const addresses = await Address.find({ _id: selectedAddressID, userId });
    const Payments = await Payment.find({ paymentOrderId, userId });

    const order = await createShiprocketOrder(orderData);

    const newOrder = await Order.create({
      userId: userId,
      products: orderData.products.items,
      totalMRP: orderData.products.totalMRP,
      discountAmount: orderData.products.totalDiscount,
      shippingCost,
      donationAmount: orderData.products.total,
      totalAmount,
      orderStatus,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      transactionId,
      isPaid,
      paidAt,
      shiprocketOrderId,
      trackingId,
      courierName,
      estimatedDelivery,
      shippedAt,
      deliveredAt,
      cancelledAt,
      notes,
    });

    res.status(201).json(newOrder);
  } catch (error) {
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
    const order = await getShiprocketOrderDetails(res.params.id);

    if (!order) return handleOrderNotFound(res);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const returnorder = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
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
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) return handleOrderNotFound(res);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
