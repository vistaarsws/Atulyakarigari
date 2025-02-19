import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  cancelOrder,
  returnorder,
} from "../controllers/order.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth);

router.post("/create", createOrder);
router.get("getOrder/:id", getOrderById);
router.put("cancel/:id", cancelOrder);
router.put("return/:id", returnorder);

router.use(isAdmin);
router.get("/getOrder", getAllOrders);
export default router;