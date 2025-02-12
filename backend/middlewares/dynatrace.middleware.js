// import { logger } from "../config/logger.js";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

// const DYNATRACE_BASE_URL = process.env.DYNATRACE_BASE_URL;
// const API_TOKEN = process.env.DYNATRACE_API_TOKEN;

// /**
//  * Middleware to track API response times in Dynatrace
//  */
// export const dynatraceMiddleware = async (req, res, next) => {
//   const start = Date.now();
//   res.on("finish", async () => {
//     const duration = Date.now() - start;
//     const status = res.statusCode;

//     logger.info(`API: ${req.method} ${req.url} - ${status} - ${duration}ms`);

//     try {
//       await axios.post(
//         `${DYNATRACE_BASE_URL}/metrics/ingest`,
//         `my.custom.api.response.time,env=production ${duration}`,
//         {
//           headers: {
//             Authorization: `Api-Token ${API_TOKEN}`,
//             "Content-Type": "text/plain",
//           },
//         }
//       );
//     } catch (error) {
//       logger.error("Error sending data to Dynatrace:", error.message);
//     }
//   });
//   next();
// };
