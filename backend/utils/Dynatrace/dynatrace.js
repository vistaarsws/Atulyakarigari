// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const DYNATRACE_BASE_URL = process.env.DYNATRACE_BASE_URL;
// const API_TOKEN = process.env.DYNATRACE_API_TOKEN;

// /**
//  * Fetch performance metrics from Dynatrace.
//  */
// export const fetchPerformanceMetrics = async () => {
//   try {
//     const response = await axios.get(`${DYNATRACE_BASE_URL}/metrics/query`, {
//       headers: { Authorization: `Api-Token ${API_TOKEN}` },
//       params: {
//         metricSelector:
//           "builtin:service.response.time,builtin:service.error.rate",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Dynatrace Metrics Error:", error.message);
//     throw error;
//   }
// };

// /**
//  * Send custom metrics to Dynatrace.
//  */
// export const sendDynatraceMetric = async (metricName, value) => {
//   try {
//     await axios.post(
//       `${DYNATRACE_BASE_URL}/metrics/ingest`,
//       `${metricName} ${value}`,
//       {
//         headers: {
//           Authorization: `Api-Token ${API_TOKEN}`,
//           "Content-Type": "text/plain",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Error sending data to Dynatrace:", error.message);
//   }
// };

// /**
//  * Fetch AI-detected problems from Dynatrace.
//  */
// export const fetchRootCauseAnalysis = async () => {
//   try {
//     const response = await axios.get(`${DYNATRACE_BASE_URL}/v2/problems`, {
//       headers: { Authorization: `Api-Token ${API_TOKEN}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching root cause analysis:", error.message);
//     throw error;
//   }
// };

// /**
//  * Trigger a synthetic user journey test in Dynatrace.
//  */
// export const triggerSyntheticTest = async () => {
//   try {
//     const response = await axios.post(
//       `${DYNATRACE_BASE_URL}/v1/synthetic/monitors`,
//       {
//         name: "E-commerce Checkout Test",
//         type: "BROWSER",
//         frequencyMin: 15,
//         locations: ["GEOLOCATION-1"],
//         script: [
//           { type: "navigate", url: "https://your-ecommerce-site.com/login" },
//           { type: "click", selector: "#login-button" },
//           { type: "navigate", url: "https://your-ecommerce-site.com/cart" },
//           { type: "click", selector: "#checkout-button" },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Api-Token ${API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error running synthetic test:", error.message);
//     throw error;
//   }
// };

// /**
//  * Send Security Alerts to Dynatrace
//  */
// export const sendSecurityAlert = async (title, severity, message) => {
//   try {
//     await axios.post(
//       `${DYNATRACE_BASE_URL}/v2/events/ingest`,
//       {
//         eventType: "CUSTOM_ALERT",
//         title: title,
//         severity: severity,
//         description: message,
//         properties: { category: "Security", app: "E-commerce" },
//       },
//       {
//         headers: {
//           Authorization: `Api-Token ${API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Error sending security alert to Dynatrace:", error.message);
//   }
// };
