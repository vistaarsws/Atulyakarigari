import "./AuthTemplate.css";
import { Flex, Input } from "antd";
import authIcon from "../../assets/images/authIcon.svg";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  signUp,
  sendOtp,
  login,
  varifyOtp,
} from "../../services/operations/authAPI";
import { setCustomDimension } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import {
  login as authLogin,
  logout as authLogout,
} from "../../Redux/features/AuthSlice";
import PropTypes from "prop-types";
import GoogleAuth from "./google-auth/GoogleAuth";

dayjs.extend(customParseFormat);

const loadingBtnStyles = {
  padding: "1rem",
  height: "4rem",
  fontSize: "1.4rem",
  backgroundColor: "#60a487",
  color: "white",
  border: "none",
  width: "100%",
};
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
  const dispatch = useDispatch();

  const [otpType, setOtpType] = useState(location.state?.type);

  const isLoginPage = page === "login";
  const isSignupPage = page === "signup";
  const isOtp = page === "otp";

  // const { loginContext, logoutContext } = useAuth();

  const handleValidateOtp = (e) => {
    const key = e.key;
    // Allow numeric keys and Backspace
    if (!/^[0-9]$/.test(key) && key !== "Backspace" && key !== "Enter") {
      e.preventDefault();
    }
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
          localStorage.setItem("loginId", userDetails.loginId);
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
      const res = await sendOtp(userDetails.loginId);
      if (res?.status === 200) {
        localStorage.setItem("loginId", userDetails.loginId);

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

        // loginContext(tokenValue);
        dispatch(authLogin(tokenValue));

        if (!tokenValue) {
          // logoutContext();
          dispatch(authLogout());
        }

        const successMessage =
          otpType === "login" ? "Login Successful!" : "Signup Successful!";
        if (
          res.data.data.accountType === "admin" ||
          res.data.data.accountType === "super-admin"
        ) {
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
      setOtp("");
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
      await login(userDetails.loginId || localStorage.getItem("loginId"));
    } else {
      await sendOtp(userDetails.loginId || localStorage.getItem("loginId"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isNumber = /^[0-9]+$/.test(value);
    let formattedValue = value;
    if (isNumber && !value.startsWith("+91")) {
      formattedValue = "+91" + value;
    }
    // localStorage.setItem(`${name}`, formattedValue);
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: formattedValue,
    }));
  };

  return (
    <>
      <div className={`authTemplate_container `}>
        <section>
          { <h1>Atulyakarigari</h1>}
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
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={loading}
                      sx={loadingBtnStyles}
                    >
                      Login
                    </LoadingButton>
                  </div>
                </div>
              </form>
              {/* Google login button */}

              <GoogleAuth />
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
                    value={userDetails.fullName}
                    sx={{
                      width: "100%",
                      mb: "1rem",
                      "& .MuiInputBase-input": {
                        fontSize: "1.4rem",
                        padding: "1rem",
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
                      },
                    }}
                    onChange={handleInputChange}
                    value={userDetails.loginId}
                  />
                </div>
                <div>
                  <LoadingButton
                    sx={loadingBtnStyles}
                    variant="contained"
                    type="submit"
                    loading={loading}
                  >
                    Sign Up
                  </LoadingButton>
                </div>
              </form>
              {/* Google login button */}

              <GoogleAuth />
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
                      onKeyDown={handleValidateOtp}
                      onChange={handleOTPChange}
                      length={4}
                    />
                  </Flex>
                </div>
                {timer > 0 ? (
                  <p style={{ minHeight: "1.5rem" }}>
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
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={loading}
                    sx={loadingBtnStyles}
                  >
                    Continue
                  </LoadingButton>
                </div>
              </form>
            </article>
          )}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {isLoginPage || otpType === "login" ? (
            <p>
              Don&apos;t have an account yet?{"  "}
              <span
                onClick={() => {
                  navigate("/signup");
                  setUserDetails("");
                }}
              >
                {" "}
                Sign Up
              </span>
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

AuthTemplate.propTypes = {
  page: PropTypes.string.isRequired,
};
