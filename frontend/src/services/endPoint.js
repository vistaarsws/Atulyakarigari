const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/api/v1/auth/send-otp",
  SIGNUP_API: BASE_URL + "/api/v1/auth/register",
  LOGIN_API: BASE_URL + "/api/v1/auth/login",
  VERIFYOTP_API: BASE_URL + "/api/v1/auth/verify-otp",
};
