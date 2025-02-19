import crypto from "crypto";
import dotenv from "dotenv";
import Payment from "../models/payment.js";

dotenv.config();

const {
  CCAVENUE_MERCHANT_ID,
  CCAVENUE_ACCESS_CODE,
  CCAVENUE_WORKING_KEY,
  CCAVENUE_REDIRECT_URL,
  CCAVENUE_CANCEL_URL,
  CCAVENUE_URL,
} = process.env;

const getFormattedKey = (key) => Buffer.from(key.substring(0, 16), "utf8");

const encrypt = (text, key) => {
  const formattedKey = getFormattedKey(key);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv("aes-128-cbc", formattedKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (text, key) => {
  const formattedKey = getFormattedKey(key);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv("aes-128-cbc", formattedKey, iv);
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export const createPayment = async (req, res) => {
  try {
    const { amount = 1 } = req.body;
    const userId = req.user?._id || "679a055764e6079f5a9b3334";

    if (!userId || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const orderId = `ORDER_${Date.now()}`;
    const payment = new Payment({ userId, paymentOrderId: orderId, amount, status: "PENDING" });
    await payment.save();

    const postData = `merchant_id=${CCAVENUE_MERCHANT_ID}&order_id=${orderId}&currency=INR&amount=${amount}&redirect_url=${CCAVENUE_REDIRECT_URL}&cancel_url=${CCAVENUE_CANCEL_URL}&language=EN`;
    
    const encRequest = encrypt(postData, CCAVENUE_WORKING_KEY);
    const paymentUrl = `${CCAVENUE_URL}?command=initiateTransaction&encRequest=${encRequest}&access_code=${CCAVENUE_ACCESS_CODE}`;

    res.json({ success: true, paymentUrl });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};

export const handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body;
    if (!encResp) return res.status(400).json({ error: "Missing encrypted response" });

    const decryptedResponse = decrypt(encResp, CCAVENUE_WORKING_KEY);
    const responseParams = new URLSearchParams(decryptedResponse);

    const orderId = responseParams.get("order_id");
    const trackingId = responseParams.get("tracking_id");
    const orderStatus = responseParams.get("order_status");

    const payment = await Payment.findOne({ paymentOrderId: orderId });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.transactionId = trackingId;
    payment.status = orderStatus === "Success" ? "COMPLETED" : "FAILED";
    await payment.save();

    res.json({ success: true, status: payment.status });
  } catch (error) {
    console.error("Payment Response Error:", error);
    res.status(500).json({ error: "Failed to process payment response" });
  }
};
