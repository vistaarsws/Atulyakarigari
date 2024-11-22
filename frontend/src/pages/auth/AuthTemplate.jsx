import "./AuthTemplate.css";
import { Flex, Input } from "antd";
import authIcon from "../../assets/images/authIcon.svg";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Button, CircularProgress } from "@mui/material";
import {
  signUp,
  sendOtp,
  login,
  varifyOtp,
} from "../../services/operations/authAPI";

dayjs.extend(customParseFormat);

export default function AuthTemplate({ page }) {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    loginId: "",
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const [otpType, setOtpType] = useState(location.state?.type);

  const isAdminLoginPage = page === "admin-login";
  const isLoginPage = page === "login";
  const isSignupPage = page === "signup";
  const isAdminOtp = page === "admin-otp";
  const isOtp = page === "otp";

  const setAuthToken = (token) => {
    if (!token) {
      console.error("Token is undefined or null.");
      return;
    }

    Cookies.set("authToken", token, {
      expires: 7, // Expires in 7 days
      sameSite: "Strict", // SameSite policy
      // secure: true, // Uncomment this in production (requires HTTPS)
    });
    console.log("Token set in cookies!");
  };

  useEffect(() => {
    setOtpType(location.state?.type);
  }, [location.state?.type]);

  // -----------------------------------------------------Login---------------------------------------------------------------------

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(userDetails.loginId);
      if (res?.status === 200) {
        if (isLoginPage) {
          navigate("/otp", { state: { type: "login" } });
        } else {
          navigate("/admin-otp", { state: { type: "admin-otp" } });
        }

        enqueueSnackbar(res.data.message || "Login Successful!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(res.data.message, {
          variant: "warning",
        });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------Signup-----------------------------------------------------------------------------------------------------------

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendOtp(userDetails.loginId);
      if (res?.status === 200) {
        navigate("/otp", {
          state: { type: "signup" },
        });
        enqueueSnackbar(res.data.message || "Signup Successful!", {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------Varify otp-------------------------------------------------------------------------------------------------------------------

  const validateOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let action;

      switch (otpType) {
        case "login":
          action = varifyOtp;
          break;
        // case "admin-login":
        //   action = signUp;
        //   break;
        case "signup":
          action = signUp;
          break;
        default:
          return;
      }

      const args =
        otpType === "login" || otpType === "admin-login"
          ? [userDetails.loginId, otp]
          : [userDetails.fullName, userDetails.loginId, otp];

      const res = await action(...args);

      if (res.status === 200) {
        const token = res.data.data.token;

        if (token) {
          setAuthToken(token);
        }

        const successMessage =
          otpType === "login" || otpType === "admin-login"
            ? "Login Successful!"
            : "Signup Successful!";

        navigate("/", { state: { type: otpType } });
        enqueueSnackbar(res.data.message || successMessage, {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.message || "An error occurred", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------------------------------------------------------------

  const handleOTPChange = (value) => {
    setOtp(value);
  };

  useEffect(() => {
    // Start the countdown when the component is mounted
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    // Clear the interval when timer reaches 0
    if (timer === 0) {
      clearInterval(countdown);
      // Optionally, redirect to another route or take some action when the timer ends
      // navigate('/resend-otp');
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(countdown);
  }, [timer]);

  const handleResendOtp = async () => {
    setTimer(30);
    setOtp("");
    if (otpType === "login" || otpType === "admin-login") {
      await login(userDetails.loginId);
    } else {
      await sendOtp(userDetails.loginId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  return (
    <>
      <div
        className={`authTemplate_container ${
          isAdminLoginPage || isAdminOtp ? "admin_authTemplate_container" : ""
        }`}
      >
        <section>
          {isLoginPage && <h1>Atulyakarigari</h1>}

          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {(isLoginPage || isAdminLoginPage) && (
            <article className="logIn_container">
              <div>
                <figure>
                  <img src={authIcon} alt="Auth Icon" />
                </figure>
                <h2>Log in</h2>
                <h3>Use your email or phone number to log in</h3>
              </div>

              <form onSubmit={loginHandler}>
                <div>
                  <div>
                    <label htmlFor="loginId">Email/Phone Number</label>
                    <input
                      type="text"
                      name="loginId"
                      id="loginId"
                      placeholder="Enter Your Email/Phone Number"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      style={{
                        backgroundColor: isAdminLoginPage ? "#5F3DC3" : "",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="white" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </article>
          )}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {isSignupPage && (
            <article className="signUp_container">
              <div>
                <figure>
                  <img src={authIcon} alt="Auth Icon" />
                </figure>

                <h2>Sign Up</h2>
                <h3>Use your email or phone number to sign up</h3>
              </div>

              <form onSubmit={signupHandler}>
                <div>
                  <div>
                    <label htmlFor="fullName">Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Enter Your Full Name"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label>Phone Number or Email*</label>
                    <input
                      type="text"
                      name="loginId"
                      id="loginId"
                      placeholder="Enter Phone Number or Email"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="white" />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </article>
          )}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {(isOtp || isAdminOtp) && (
            <article className="Otp_container">
              <div>
                <figure>
                  <img src={authIcon} alt="Auth Icon" />
                </figure>

                <h2>Verify OTP</h2>
                <h3>
                  sent to <span>+91 8175961513</span>
                </h3>
              </div>

              <form onSubmit={validateOtpHandler}>
                <div className="otp_inputBox">
                  <Flex gap="middle" align="flex-center" vertical>
                    <Input.OTP
                      variant="filled"
                      inputMode="numeric"
                      value={otp}
                      onChange={handleOTPChange}
                      length={4}
                    />
                  </Flex>
                </div>
                {timer > 0 ? (
                  <p>
                    Resent OTP in <span>{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    className="resendBtn"
                    onClick={handleResendOtp}
                  >
                    Resend
                  </button>
                )}

                <div>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: isAdminOtp ? "#5F3DC3" : "",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="white" />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </form>
            </article>
          )}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {!isAdminLoginPage &&
            !isAdminOtp &&
            (isLoginPage || otpType === "login" ? (
              <p>
                Don&apos;t have an account yet?{"  "}
                <span onClick={() => navigate("/signup")}>Sign Up</span>
              </p>
            ) : (
              <p>
                Already have account?{"  "}
                <span onClick={() => navigate("/login")}>Log In</span>
              </p>
            ))}
        </section>
        {!isAdminLoginPage && !isAdminOtp && <section></section>}
      </div>
    </>
  );
}
