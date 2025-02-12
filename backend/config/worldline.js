import dotenv from "dotenv";
import fetch from "node-fetch";
import { logger } from "../config/logger.js"; // Custom logger
import { logMessage } from "../utils/winston-logger/logHelper.js"; // Custom log function

dotenv.config();

const { WORLDLINE_API_BASE, WORLDLINE_MERCHANT_ID, WORLDLINE_SECRET_KEY, FRONTEND_URL } = process.env;

/**
 * Function to generate a payment request payload for Worldline API.
 * @param {Object} order - Order object containing `_id` and `totalAmount`.
 * @returns {Object} - API response containing payment details.
 */
export const createPaymentRequest = async (order) => {
  if (!order || !order._id || !order.totalAmount) {
    logMessage("error", "Invalid order object provided", "worldline-errors");
    throw new Error("Invalid order object provided.");
  }

  const url = `${WORLDLINE_API_BASE}/payments`;
  const payload = {
    merchant_id: WORLDLINE_MERCHANT_ID,
    order_id: order._id,
    amount: order.totalAmount,
    currency: "INR",
    redirect_url: `${FRONTEND_URL}/payment-success`,
    cancel_url: `${FRONTEND_URL}/payment-failure`,
  };

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${WORLDLINE_SECRET_KEY}`,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logMessage("error", `Worldline API Error! Status: ${response.status} - ${errorText}`, "worldline-errors");
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    logMessage("info", `Payment request successful for Order: ${order._id}`, "worldline-info");

    return data; // Returns payment URL or transaction ID
  } catch (error) {
    logMessage("error", `Worldline Payment Error: ${error.message}`, "worldline-errors");
    throw error;
  }
};
