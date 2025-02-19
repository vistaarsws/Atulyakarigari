import express from "express";
import { createPayment, handlePaymentResponse } from "../controllers/payment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.post("/create-payment", createPayment);
router.post("/payment-response", handlePaymentResponse);

export default router;
