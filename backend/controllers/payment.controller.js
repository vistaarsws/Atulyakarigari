import Payment from "../models/payment.js";
import { encrypt, decrypt } from "../utils/encryption/cryptoUtils.js";
import keys from "../config/ccAvenue.js";
import { v4 as uuidv4 } from "uuid";

const generatePaymentOrderId = () => `ORD-${uuidv4()}`;

// ✅ Create Payment Request
export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User authentication required" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentOrderId = generatePaymentOrderId();

    const newPayment = new Payment({ paymentOrderId, userId, amount, status: "PENDING" });
    await newPayment.save();

    const postData = `merchant_id=${keys.merchantId}&order_id=${paymentOrderId}&currency=INR&amount=${amount}&redirect_url=${keys.redirectUrl}&cancel_url=${keys.cancelUrl}&billing_name=John Doe&billing_email=john@example.com&billing_tel=9876543210&billing_address=123 Test Street&billing_city=Mumbai&billing_state=Maharashtra&billing_zip=400001&billing_country=India&integration_type=iframe_normal&language=EN&merchant_param1=${userId}`;

    const encRequest = encrypt(postData);

    console.log("Encrypted Request:", encRequest);
    console.log("Decrypted Check:", decrypt(encRequest));

    const paymentUrl = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${keys.accessCode}`;

    res.json({ success: true, paymentUrl });
  } catch (error) {
    console.error("Payment Creation Error:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};

// ✅ Handle Payment Response
export const handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body;
    
    if (!encResp || typeof encResp !== "string" || encResp.length < 32) {
      return res.status(400).json({ error: "Invalid or missing CCAvenue response" });
    }

    const decryptedResponse = decrypt(encResp);
    console.log("Decrypted Response:", decryptedResponse);

    const responseParams = new URLSearchParams(decryptedResponse);
    const paymentOrderId = responseParams.get("order_id");
    const trackingId = responseParams.get("tracking_id");
    const orderStatus = responseParams.get("order_status");

    if (!paymentOrderId) {
      return res.status(400).json({ error: "Invalid response: Missing order_id" });
    }

    const payment = await Payment.findOne({ paymentOrderId });
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    payment.transactionId = trackingId;
    
    if (orderStatus === "Success") {
      payment.status = "COMPLETED";
    } else if (orderStatus === "Aborted") {
      payment.status = "CANCELED";
    } else {
      payment.status = "FAILED";
    }

    await payment.save();

    const frontendRedirectUrl = orderStatus === "Success"
      ? `${keys.frontendUrl}/payment-success`
      : `${keys.frontendUrl}/payment-failed`;

    res.redirect(frontendRedirectUrl);
  } catch (error) {
    console.error("Payment Response Error:", error);
    res.status(500).json({ error: "Payment response handling failed" });
  }
};
