import dotenv from "dotenv";
dotenv.config();

export const WorldLineConfig = {
  MERCHANT_ID: process.env.WORLDLINE_MERCHANT_ID,
  API_KEY: process.env.WORLDPAY_API_KEY,
  SECRET_KEY: process.env.WORLDPAY_SECRET_KEY,
  SALT: process.env.WORLDLINE_SALT,
  WORLDPAY_BASE_URL: process.env.WORLDPAY_BASE_URL,
};
