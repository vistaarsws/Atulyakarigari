import dotenv from "dotenv";
dotenv.config();

export const shiprocketConfig = {
  API_BASE: process.env.SHIPROCKET_API_BASE || "https://apiv2.shiprocket.in/v1/external",
  EMAIL: process.env.SHIPROCKET_EMAIL,
  PASSWORD: process.env.SHIPROCKET_PASSWORD,
};
