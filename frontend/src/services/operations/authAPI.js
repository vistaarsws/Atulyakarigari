import { apiConnector } from "../apiConnector";
import { endpoints } from "../endPoint";

const sendOtp = async (loginId) => {
  try {
    const response = await apiConnector("POST", endpoints.SENDOTP_API, {
      loginId,
    });
    console.log("SENDOTP API RESPONSE............", response);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response;
  } catch (error) {
    console.log("SENDOTP API ERROR............", error);
  } finally {
  }
};
// };

const varifyOtp = async (loginId, otp) => {
  try {
    const response = await apiConnector("POST", endpoints.VERIFYOTP_API, {
      loginId,
      otp,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

const signUp = async (fullName, loginId, otp, accountType = "customer") => {
  try {
    const response = await apiConnector("POST", endpoints.SIGNUP_API, {
      fullName,
      loginId,
      accountType,
      otp,
    });

    console.log("SIGNUP API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  } catch (error) {
    console.log("SIGNUP API ERROR............", error);
    const errorResponse = error?.response?.data?.message;
  }
};

const login = async (loginId) => {
  try {
    const response = await apiConnector("POST", endpoints.LOGIN_API, {
      loginId,
    });

    console.log("LOGIN API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response;
  } catch (error) {
    console.log("LOGIN API ERROR............", error);

    const errorResponse = error?.response?.data?.message;
  }
};

// const logout = (navigate) => {
//     return (dispatch) => {
//         localStorage.removeItem("token")
//         localStorage.removeItem("user")
//         toast.success("Logged Out")
//         navigate("/")
//     }
// }

export {
  sendOtp,
  signUp,
  login,
  //  logout,
  varifyOtp,
};
