import "./AuthTemplate.css";
import { Flex, Input } from "antd";
import authIcon from "../../assets/images/authIcon.svg";
import { useState, useEffect } from "react";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const url = useParams();
  const navigate = useNavigate();
  const otpType = location.state?.type;

  // -------------------------------------------------------------------------------------------------------------------------
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    loginId: "",
  });

  // -----------------------------------------------------Login---------------------------------------------------------------------

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(userDetails.loginId);
      if (res?.status === 200) {
        navigate("/otp", { state: { type: "login" } });
        enqueueSnackbar(res.data.message || "Login Successful!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(res.data.message, {
          variant: "warning",
        });
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
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
        navigate("/otp", { state: { type: "signup" } });
        enqueueSnackbar(res.data.message || "Signup Successful!", {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------Varify otp-------------------------------------------------------------------------------------------------------------------

  const validateOtpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const action = otpType === "login" ? varifyOtp : signUp;
      const args =
        otpType === "login"
          ? [userDetails.loginId, otp]
          : [userDetails.fullName, userDetails.loginId, otp];

      const res = await action(...args);

      if (res.status === 200) {
        const successMessage =
          otpType === "login" ? "Login Successful!" : "Signup Successful!";
        navigate("/", { state: { type: otpType } });
        enqueueSnackbar(res.data.message || successMessage, {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error during OTP validation:", error);
      enqueueSnackbar(error?.message || "An error occurred", {
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
    if (otpType === "login") {
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
      <div className="authTemplate_container">
        <section>
          <h1>Atulyakarigari</h1>
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {page === "login" && (
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
          {page === "signup" && (
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
          {page === "otp" && (
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
                  <button className="resendBtn" onClick={handleResendOtp}>
                    Resend
                  </button>
                )}

                <div>
                  <Button variant="contained" type="submit" disabled={loading}>
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
          {page === "login" || otpType === "login" ? (
            <p>
              Don&apos;t have an account yet?{"  "}
              <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
          ) : (
            <p>
              Already have account?{"  "}
              <span onClick={() => navigate("/login")}>Log In</span>
            </p>
          )}
        </section>
        <section></section>
      </div>
    </>
  );
}
