import axios from "axios";
import crypto from "crypto";
import { WorldLineConfig } from "../../config/worldline.js";
import Payment from "../../models/payment.js";

export const initiatePayment = async (paymentPayload) => {
  const { paymentOrderId, amount, userId, customerEmail, customerMobile } = paymentPayload;

  const hashString = `${WorldLineConfig.MERCHANT_ID}|${paymentOrderId}|${amount.toFixed(2)}|INR|${customerEmail || ""}|${customerMobile || ""}|${WorldLineConfig.SALT}`;
  
  const secureHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  const txnRequest = {
    merchant: { identifier: WorldLineConfig.MERCHANT_ID },
    transaction: {
      deviceIdentifier: "S",
      amount: amount.toFixed(2),
      currency: "INR",
      dateTime: new Date().toISOString(),
      token: paymentOrderId,
      requestType: "T",
    },
    consumer: {
      identifier: userId || paymentOrderId,
      emailID: customerEmail || "",
      mobileNumber: customerMobile || "",
    },
    cart: { items: [] },
    secureHash,
  };

  try {
    const response = await axios.post(WorldLineConfig.BASE_URL, txnRequest, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("Worldline Initiate Payment Error:", error);
    throw new Error("Failed to initiate payment");
  }
};

export const verifyPaymentStatusService = async (paymentOrderId) => {
  try {
    const response = await axios.get(
      `${WorldLineConfig.BASE_URL}/payments/${paymentOrderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WorldLineConfig.API_KEY}`,
        },
      }
    );

    const { status, transactionId, amount } = response.data;

    if (!status) {
      throw new Error("Invalid response from Worldline");
    }

    // Update Payment Status in Database
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentOrderId },
      {
        status: status === "SUCCESS" ? "Completed" : "Failed",
        transactionId,
        amount,
      },
      { new: true }
    );

    return {
      success: true,
      message: "Payment Status Updated",
      payment: updatedPayment,
    };
  } catch (error) {
    console.error("Payment Status Check Error:", error);
    return { success: false, message: "Server Error" };
  }
};
