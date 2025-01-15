import axios from "axios";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../endPoint";

const sendOtp = async (loginId) => {
  const response = await apiConnector("POST", endpoints.SENDOTP_API, {
    loginId,
  });

  return response;
};

const varifyOtp = async (loginId, otp) => {
  const response = await apiConnector("POST", endpoints.VERIFYOTP_API, {
    loginId,
    otp,
  });

  return response;
};

const signUp = async (fullName, loginId, otp, accountType = "customer") => {
  const response = await apiConnector("POST", endpoints.SIGNUP_API, {
    fullName,
    loginId,
    accountType,
    otp,
  });

  return response;
};

const login = async (loginId) => {
  // debugger;
  const response = await apiConnector("POST", endpoints.LOGIN_API, {
    loginId,
  });
  // const res = await axios.post(endpoints.LOGIN_API, { loginId });
  return response;
};

export { sendOtp, signUp, login, varifyOtp };
