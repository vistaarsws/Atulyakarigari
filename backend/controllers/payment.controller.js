import Address from "../models/Address.js";
import Payment from "../models/payment.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/**
 * Convert Hex to Buffer for AES Key
 */
const getAESKey = (key) => Buffer.from(key, "hex"); // Convert HEX key to 16-byte Buffer

/**
 * AES Encryption Function (Now using AES-128-CBC)
 */
const encryptData = (data, key) => {
  const aesKey = getAESKey(key);
  const iv = Buffer.alloc(16, 0); // IV required for CBC mode
  const cipher = crypto.createCipheriv("aes-128-cbc", aesKey, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

/**
 * AES Decryption Function (Now using AES-128-CBC)
 */
const decryptData = (data, key) => {
  const aesKey = getAESKey(key);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv("aes-128-cbc", aesKey, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

/**
 * Initiate Payment Request (CCAvenue)
 */
export const initiatePayment = async (req, res) => {
  try {
    const {order_id, amount, currency } = req.body;
    const userId = req.user._id;
    // Validate input data
    if (!userId || !order_id || !amount || !currency) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Load Environment Variables
    const merchant_id = process.env.MERCHANT_ID;
    const access_code = process.env.ACCESS_CODE;
    const working_key = process.env.WORKING_KEY;
    const redirect_url = process.env.REDIRECT_URL;
    const cancel_url = process.env.CANCEL_URL;

    // Check if TEST_MODE is enabled
    const isTestMode = process.env.TEST_MODE === "true";

    // Select the correct CCAvenue URL
    const ccavenueUrl = isTestMode
      ? "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
      : "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

    // Construct Payment Data String
    const postData = `merchant_id=${merchant_id}&order_id=${order_id}&currency=${currency}&amount=${amount}&redirect_url=${redirect_url}&cancel_url=${cancel_url}&language=EN`;

    // Encrypt Data
    const encryptedData = encryptData(postData, working_key);

    // Save Payment Record in Database
    const newPayment = new Payment({
      userId,
      paymentOrderId: order_id,
      amount,
      currency,
      status: "PENDING",
    });
    await newPayment.save();

    res.json({
      encRequest: encryptedData,
      access_code,
      ccavenue_url: ccavenueUrl,
      mode: isTestMode ? "TEST" : "LIVE",
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Handle CCAvenue Response and Update Payment Status
 */
export const paymentResponse = async (req, res) => {
  try {
    const working_key = process.env.WORKING_KEY;
    const encryptedResponse = req.body.encResp;

    // Check if response is valid
    if (!encryptedResponse) {
      return res.status(400).json({ error: "Invalid response data" });
    }

    // Decrypt Response
    const decryptedResponse = decryptData(encryptedResponse, working_key);
    console.log("Decrypted CCAvenue Response:", decryptedResponse);

    // Convert Response to JSON
    const responseParams = new URLSearchParams(decryptedResponse);
    let responseObj = {};
    responseParams.forEach((value, key) => {
      responseObj[key] = value;
    });

    const { order_id, tracking_id, order_status, amount } = responseObj;

    // Find and Update Payment Record in DB
    const payment = await Payment.findOne({ paymentOrderId: order_id });

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    payment.transactionId = tracking_id || null;
    payment.status = order_status === "Success" ? "COMPLETED" : "FAILED";
    await payment.save();

    // Redirect user to success/failure page
    const redirectUrl =
      order_status === "Success"
        ? process.env.SUCCESS_PAGE_URL
        : process.env.FAILURE_PAGE_URL;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error processing payment response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
