import Payment from "../models/payment.js";
import { encrypt, decrypt } from "../utils/encryption/cryptoUtils.js";
import { v4 as uuidv4 } from "uuid";
import config from "../config/ccAvenue.js";

const generatePaymentOrderId = () => `ORD-${uuidv4()}`;

export const createPayment = async (req, res) => {
  try {
    console.log(
      "📏 HEX Working Key Length:",
      Buffer.from(config.workingKey, "hex").length
    );

    let { products, donationAmount  } = req.body;
    const userId = req.user?._id;
    let amount =products.total;

    productId = "65b7e2c4d6b2f507c6f1e101";

    if (!userId)
      return res.status(400).json({ error: "User authentication required" });
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });
    if (!productId)
      return res.status(400).json({ error: "Product ID is required" });

    let payment = await Payment.findOne({
      userId,
      productId,
      status: { $in: ["PENDING", "FAILED"] },
    });

    let paymentOrderId;

    if (payment) {
      paymentOrderId = payment.paymentOrderId;
      console.log(`🔄 Reusing Existing Order ID: ${paymentOrderId}`);

      if (payment.amount !== amount) {
        payment.amount = amount;
        await payment.save();
      }
    } else {
      paymentOrderId = generatePaymentOrderId();
      console.log(`🆕 Created New Order ID: ${paymentOrderId}`);

      payment = new Payment({
        paymentOrderId,
        userId,
        productId,
        amount,
        status: "PENDING",
      });

      await payment.save();
    }

    const postData = new URLSearchParams({
      merchant_id: config.merchantId,
      order_id: paymentOrderId,
      currency: "INR",
      amount,
      redirect_url: config.redirectUrl,
      cancel_url: config.cancelUrl,
      integration_type: "iframe_normal",
      language: "EN",
      merchant_param1: userId,
    }).toString();

    console.log("📦 Post Data Before Encryption:", postData);

    const encRequest = encrypt(postData);
    console.log("🔐 Encrypted Request:", encRequest);

    const paymentUrl = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${config.accessCode}`;

    res.status(201).json({ success: true, paymentUrl });
  } catch (error) {
    console.error("❌ Payment Creation Error:", error);
    res.status(500).json({ errorMessage: "Payment initiation failed", error });
  }
};
export const handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body;

    if (!encResp) {
      console.error("❌ Invalid CCAvenue Response: encResp is missing");
      return res
        .status(400)
        .json({ errorMessage: "Invalid CCAvenue response" });
    }

    const decryptedResponse = decrypt(encResp);
    console.log("🔓 Decrypted Response:", decryptedResponse);

    const responseParams = new URLSearchParams(decryptedResponse);
    const paymentOrderId = responseParams.get("order_id");
    const trackingId = responseParams.get("tracking_id");
    const orderStatus = responseParams.get("order_status");

    const payment = await Payment.findOne({ paymentOrderId });
    if (!payment) {
      console.error(`❌ Payment Not Found for Order ID: ${paymentOrderId}`);
      return res.status(404).json({ error: "Payment not found" });
    }

    console.log(`✅ Order Status: ${orderStatus}, Tracking ID: ${trackingId}`);

    payment.transactionId = trackingId;
    payment.status =
      orderStatus === "Success"
        ? "COMPLETED"
        : orderStatus === "Aborted"
        ? "CANCELED"
        : "FAILED";
    await payment.save();

    const frontendRedirectUrl =
      orderStatus === "Success"
        ? config.frontendSuccessUrl
        : config.frontendFailureUrl;
    res.redirect(frontendRedirectUrl);
  } catch (error) {
    console.error("❌ Payment Response Error:", error);
    res.status(500).json({ error: "Payment response handling failed" });
  }
};
