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
    const payment = await Payment.findOne({ paymentOrderId, userId });

    if (!address) return res.status(400).json({ message: "Invalid address" });
    if (!payment) return res.status(400).json({ message: "Invalid payment" });

    const {
      products,
      totalMRP,
      totalDiscount,
      shippingCost = 0,
      totalAmount,
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
    } = orderData;

    const newOrder = await Order.create({
      userId,
      products: products.items,
      totalMRP,
      discountAmount: totalDiscount,
      shippingCost,
      totalAmount,
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
