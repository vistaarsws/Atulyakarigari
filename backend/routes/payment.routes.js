import express from "express";
import {
  createPayment,
  handlePaymentResponse,
} from "../controllers/payment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.use(auth);

router.post("/create-payment", createPayment);
router.post("/payment-response", handlePaymentResponse);
router.post("/payment-failed", (req, res) => {
  console.log("Payment Failed Response:", req.body);
  res.redirect(process.env.FRONTEND_FAILURE_URL);
});

export default router;
