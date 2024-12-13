import "./AuthTemplate.css";
import { Flex, Input } from "antd";
import authIcon from "../../assets/images/authIcon.svg";
import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Button, CircularProgress, TextField } from "@mui/material";
import {
  signUp,
  sendOtp,
  login,
  varifyOtp,
} from "../../services/operations/authAPI";
import { useAuth } from "../../context/AuthContext";
import setCustomDimension from "../../utils/helpers";

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

  const isLoginPage = page === "login";
  const isSignupPage = page === "signup";
  const isOtp = page === "otp";

  const { loginContext, logoutContext } = useAuth();
  // const setAuthToken = (token) => {
  //   if (!token) {
  //     console.error("Token is undefined or null.");
  //     return;
  //   }

  //   Cookies.set("authToken", token, {
  //     expires: 7, // Expires in 7 days
  //     sameSite: "Strict", // SameSite policy
  //     // secure: true, // Uncomment this in production (requires HTTPS)
  //   });
  //   console.log("Token set in cookies!");
  // };

  // Google Login Handler
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:3000/auth/login"; // Change URL for production
  };

  useEffect(() => {
    setOtpType(location.state?.type);
  }, [location.state?.type]);

  // -----------------------------------------------------Login---------------------------------------------------------------------

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(
        userDetails.loginId || localStorage.getItem("loginId")
      );
      if (res?.status === 200) {
        if (isLoginPage) {
          navigate("/otp", { state: { type: "login" } });
        }
        enqueueSnackbar(res.data.message || "Login Successful!", {
          variant: "success",
        });

        setCustomDimension("dimension1", userDetails.role); // Example: Set user role
        setCustomDimension("dimension2", userDetails.id); // Example: Set user ID;
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
      const res = await sendOtp(
        userDetails.loginId || localStorage.getItem("loginId")
      );
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
        case "signup":
          action = signUp;
          break;
        default:
          return;
      }

      const args =
        otpType === "login"
          ? [userDetails.loginId || localStorage.getItem("loginId"), otp]
          : [userDetails.fullName, userDetails.loginId, otp];

      const res = await action(...args);

      if (res.status === 200) {
        const tokenValue = res.data.data.token;

        loginContext(tokenValue);

        if (!tokenValue) {
          logoutContext();
        }

        const successMessage =
          otpType === "login" ? "Login Successful!" : "Signup Successful!";
        if (res.data.data.accountType === "admin") {
          navigate("/admin", { state: { type: otpType } });
        } else {
          navigate("/", { state: { type: otpType } });
        }
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
    if (otpType === "login") {
      await login(userDetails.loginId);
    } else {
      await sendOtp(userDetails.loginId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isNumber = /^[0-9]+$/.test(value);
    let formattedValue = value;
    if (isNumber && !value.startsWith("+91")) {
      formattedValue = "+91" + value;
    }
    localStorage.setItem(`${name}`, formattedValue);
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: formattedValue,
    }));
  };

  return (
    <>
      <div className={`authTemplate_container `}>
        <section>
          {isLoginPage && <h1>Atulyakarigari</h1>}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {isLoginPage && (
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
                    <TextField
                      label=""
                      sx={{
                        width: "100%",
                        marginBottom: "2rem",
                        "& .MuiInputBase-input": {
                          fontSize: "1.4rem",
                          padding: "1rem",
                          height: "unset",
                          lineHeight: "1.75",
                        },

                        "& .MuiInputBase-input::placeholder": {
                          fontSize: "1.4rem",
                        },
                      }}
                      placeholder="Enter Your Email / Phone Number"
                      id="loginId"
                      name="loginId"
                      value={userDetails.loginId}
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
              {/* Google login button */}
              <Button
                variant="contained"
                color="primary"
                onClick={loginWithGoogle}
              >
                Log in with Google
              </Button>
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

              <form onSubmit={signupHandler} className="signUpForm">
                <div>
                  <TextField
                    placeholder="Enter Your Full Name"
                    id="fullName"
                    name="fullName"
                    label=""
                    variant="outlined"
                    value={
                      userDetails.fullName || localStorage.getItem("fullName")
                    }
                    sx={{
                      width: "100%",
                      mb: "1rem",
                      "& .MuiInputBase-input": {
                        fontSize: "1.4rem",
                        padding: "1rem",
                        height: "unset",
                        lineHeight: "1.75",
                      },

                      "& .MuiInputBase-input::placeholder": {
                        fontSize: "1.4rem",
                      },
                    }}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <TextField
                    placeholder="Enter Phone Number or Email"
                    id="loginId"
                    name="loginId"
                    label=""
                    variant="outlined"
                    sx={{
                      width: "100%",
                      mb: "2rem",
                      "& .MuiInputBase-input": {
                        fontSize: "1.4rem",
                        padding: "1rem",
                        height: "unset",
                        lineHeight: "1.75",
                      },

                      "& .MuiInputBase-input::placeholder": {
                        fontSize: "1.4rem",
                      },
                    }}
                    onChange={handleInputChange}
                    value={
                      userDetails.loginId || localStorage.getItem("loginId")
                    }
                  />
                </div>
                <div>
                  <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? (
                      <CircularProgress size={24} color="white" />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            </article>
          )}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {isOtp && (
            <article className="Otp_container">
              <div>
                <figure>
                  <img src={authIcon} alt="Auth Icon" />
                </figure>

                <h2>Verify OTP</h2>
                <h3>
                  sent to
                  <span>{localStorage.getItem("loginId")}</span>
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
          {isLoginPage || otpType === "login" ? (
            <p>
              Don&apos;t have an account yet?{"  "}
              <span onClick={() => navigate("/signup")}> Sign Up</span>
            </p>
          ) : (
            <p>
              Already have account?{"  "}
              <span onClick={() => navigate("/login")}> Log In</span>
            </p>
          )}
        </section>
        <section></section>
      </div>
    </>
  );
}
