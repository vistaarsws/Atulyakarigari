import Order from "../models/order.js";

const handleOrderNotFound = (res) => {
  return res.status(404).json({ message: "Order not found" });
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products, shippingAddress, paymentMethod } = req.body;

    const totalAmount = products.reduce(
      (sum, { price, quantity }) => sum + price * quantity,
      0
    );

    const newOrder = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
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
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    if (!order) return handleOrderNotFound(res);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
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

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) return handleOrderNotFound(res);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};