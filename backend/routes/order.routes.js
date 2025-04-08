import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  cancelOrder,
  returnOrder,
  getUserOrders,
} from "../controllers/order.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth);

router.post("/create", createOrder);
router.post("/getOrder", getOrderById);
router.post("/cancel", cancelOrder);
router.post("/return", returnOrder);
router.get("/getUserOrders", getUserOrders);

router.use(isAdmin);
router.get("/getOrders", getAllOrders);

export default router;
