import dotenv from "dotenv";

dotenv.config();

export default {
  merchantId: process.env.CCAVENUE_MERCHANT_ID,
  accessCode: process.env.CCAVENUE_ACCESS_CODE,
  workingKey: process.env.CCAVENUE_WORKING_KEY,
  redirectUrl: process.env.CCAVENUE_REDIRECT_URL,
  cancelUrl: process.env.CCAVENUE_CANCEL_URL,
  baseUrl: process.env.CCAVENUE_BASE_URL,
  frontendSuccessUrl: process.env.FRONTEND_SUCCESS_URL,
  frontendFailureUrl: process.env.FRONTEND_FAILURE_URL,
};