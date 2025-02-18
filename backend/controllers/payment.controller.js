import {
  initiatePayment,
  verifyPaymentStatusService,
} from "../utils/worldline-service/worldLineService.js";
import Address from "../models/Address.js";
import Payment from "../models/payment.js";

export const handlePayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.loginId;
    const { selectedAddressID, orderData } = req.body;

    // Fetch user address from the database
    const address = await Address.findOne({ _id: selectedAddressID, userId });

    if (!address) {
      return res.status(400).json({ message: "Invalid address selection" });
    }

    // Create a unique Order ID
    const paymentOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Prepare Payment Payload
    const paymentPayload = {
      paymentOrderId,
      amount: orderData.products.total, // Ensure this is in correct minor unit format if needed
      userId,
      customerEmail: email,
      customerMobile: address.mobileNumber,
    };

    // Step 1: Initiate Payment via Worldline API
    const paymentData = await initiatePayment(paymentPayload);

    if (!paymentData || !paymentData.paymentUrl) {
      return res.status(400).json({ message: "Failed to generate payment URL" });
    }

    // Save Payment Data in MongoDB
    await Payment.create({
      userId,
      paymentOrderId,
      amount: orderData.products.total,
      status: "PENDING",
      paymentUrl: paymentData.paymentUrl,
    });

    // Step 2: Redirect User to Payment Gateway
    return res.json({ paymentUrl: paymentData.paymentUrl });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const verifyPaymentStatus = async (req, res) => {
  try {
    const { paymentOrderId } = req.params;

    if (!paymentOrderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Step 3: Verify Payment Status via Worldline API
    const result = await verifyPaymentStatusService(paymentOrderId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Payment Status Controller Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
