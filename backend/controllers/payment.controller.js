import { encrypt, decrypt } from "../utils/encryption/cryptoUtils.js";
import config from "../config/ccAvenue.js";
import Payment from "../models/payment.js";

const generatePaymentOrderId = () => {
  return `ORD-${Math.random().toString().slice(2, 12)}`;
};

export const createPayment = async (req, res) => {
  try {
    const {
      totalAmount,
      productIds = [],
      selectedAddressID,
      totalDiscount,
      totalMRP,
      donationAmounts,
    } = req.body;
    const userId = req.user?._id;

    if (!userId)
      return res.status(400).json({ error: "User authentication required" });

    let amount = Number(totalAmount) + Number(donationAmounts);
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });

    if (!Array.isArray(productIds) || productIds.length === 0)
      return res.status(400).json({ error: "Product IDs are required" });

    // productIds = [...new Set(productIds.map((id) => id.toString()))];

    let payment = await Payment.findOne({
      userId,
      productIds: { $all: productIds },
      selectedAddressID,
      status: { $in: ["PENDING", "FAILED"] },
    });

    let paymentOrderId = payment
      ? payment.paymentOrderId
      : generatePaymentOrderId();
    if (!payment) {
      payment = new Payment({
        paymentOrderId,
        userId,
        productIds,
        addressId: selectedAddressID,
        amount,
        totalDiscount,
        totalMRP,
        donationAmounts,
        status: "PENDING",
      });
      await payment.save();
    }

    const postData = `merchant_id=${config.merchantId}&order_id=${paymentOrderId}&currency=INR&amount=${amount}&redirect_url=${config.redirectUrl}&cancel_url=${config.cancelUrl}&integration_type=iframe_normal&language=EN&merchant_param1=${userId}`;
    const encRequest = encrypt(postData);

    const paymentForm = `
      <html>
        <body>
          <center>
            <iframe width="482" height="500" scrolling="No" frameborder="0" id="paymentFrame"
              src="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${config.merchantId}&encRequest=${encRequest}&access_code=${config.accessCode}">
            </iframe>
          </center>
          <script>
            document.getElementById("paymentFrame").onload = function() {
              window.addEventListener("message", function(e) {
                document.getElementById("paymentFrame").style.height = e.data["newHeight"] + "px";
              }, false);
            };
          </script>
        </body>
      </html>`;

    res.status(201).send(paymentForm);
  } catch (error) {
    console.error("Payment Creation Error:", error);
    res.status(500).json({ errorMessage: "Payment initiation failed", error });
  }
};

export const handlePaymentResponse = async (req, res) => {
  try {
    const { encResp } = req.body;
    if (!encResp)
      return res
        .status(400)
        .json({ errorMessage: "Invalid CCAvenue response" });

    const decryptedResponse = decrypt(encResp);
    console.log("Decrypted Response:", decryptedResponse);

    const responseParams = new URLSearchParams(decryptedResponse);
    const paymentOrderId = responseParams.get("order_id");
    const trackingId = responseParams.get("tracking_id") || "N/A";
    const orderStatus = responseParams.get("order_status");

    if (!paymentOrderId)
      return res.status(400).json({ error: "Invalid payment response" });

    const payment = await Payment.findOne({ paymentOrderId });
    if (!payment) return res.status(404).json({ error: "Payment not found" });

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
    console.error("Payment Response Error:", error);
    res.status(500).json({ error: "Payment response handling failed" });
  }
};
