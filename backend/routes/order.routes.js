import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth); // Apply authentication middleware to all routes

router.post("/create", createOrder); // Create a new order
router.get("/all", getAllOrders); // Get all orders
router.get("/:id", getOrderById); // Get order by ID
router.put("/:id", updateOrderStatus); // Update order status by ID
router.delete("/:id", deleteOrder); // Delete order by ID

export default router;