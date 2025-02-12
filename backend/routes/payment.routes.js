// import express from "express";
// import { initiatePayment, handlePaymentSuccess } from "../controllers/paymentController.js";

// const router = express.Router();

// router.post("/initiate", initiatePayment);
// router.post("/success", handlePaymentSuccess);

// export default router;


// import { sendDynatraceMetric } from "../utils/dynatrace.js";

// router.post("/checkout", async (req, res) => {
//   const start = Date.now();
//   try {
//     const paymentResponse = await processPayment(req.body);
//     await sendDynatraceMetric("ecommerce.checkout.success", Date.now() - start);
//     res.json({ success: true, data: paymentResponse });
//   } catch (error) {
//     await sendDynatraceMetric("ecommerce.checkout.failure", 1);
//     res.status(500).json({ success: false, message: "Checkout failed." });
//   }
// });


// import { sendDynatraceMetric } from "./dynatrace.js";

// export const sendOrderConfirmation = async (user, order) => {
//   try {
//     // Send email logic...
//     await sendDynatraceMetric("ecommerce.email.success", 1);
//   } catch (error) {
//     await sendDynatraceMetric("ecommerce.email.failure", 1);
//     console.error("Failed to send order confirmation email:", error);
//   }
// };



// import { sendDynatraceMetric } from "../utils/dynatrace.js";

// router.post("/refund", async (req, res) => {
//   try {
//     await processRefund(req.body);
//     await sendDynatraceMetric("ecommerce.refund.success", 1);
//     res.json({ success: true });
//   } catch (error) {
//     await sendDynatraceMetric("ecommerce.refund.failure", 1);
//     res.status(500).json({ success: false, message: "Refund failed." });
//   }
// });
