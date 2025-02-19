import express from "express";
import {
  handlePayment,
  verifyPaymentStatus,
  // getAllPaymentData,
} from "../controllers/payment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth);

router.post("/pay", handlePayment);
router.post("/status/:paymentOrderId", verifyPaymentStatus);
// router.get("/info", getAllPaymentData);

export default router;
