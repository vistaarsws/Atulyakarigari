import "./AuthTemplate.css";
import { Flex, Input } from "antd";
import authIcon from "../../assets/images/authIcon.svg";
import { useState, useEffect } from "react";

import { message } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate, useParams } from "react-router-dom";

dayjs.extend(customParseFormat);

export default function AuthTemplate({ page }) {
  // -------------------------------------------------------------------------------------------------------------------------
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    hintName: "",
    gender: "",
    dob: "",
    location: "",
  });

  const url = useParams();
  const navigate = useNavigate();

  const onChange = (text) => {
    console.log("onChange:", text);
  };

  const sharedProps = {
    onChange,
  };

  const handleOTPChange = (e) => {
    const numericInput = e.target.value.replace(/\D/g, "");
    setOtp(numericInput);
  };
  // -----------------------------------------------------------------------------------------------------------------------------

  const handleMenuClick = (e) => {
    message.info("Click on menu item.");
    console.log("click", e);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const items = [
    {
      label: "1st menu item",
      key: "1",
    },
    {
      label: "2nd menu item",
      key: "2",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
    {
      label: "4th menu item",
      key: "4",
    },
  ];

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

  const handleResendOtp = () => {
    setTimer(30); // Reset the timer to 30 seconds (or desired time)
  };

  const userDetailsHandler = (e) => {};

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

              <form>
                <div>
                  <div>
                    <label htmlFor="">Email or Phone Number</label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="Enter Your Name"
                    />
                  </div>

                  <div>
                    <button type="button" onClick={() => navigate("/otp")}>
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </article>
          )}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {page === "signup" && (
            <article className="signUp_container">
              <div className={url.page == 2 ? "hideIt" : ""}>
                <figure>
                  <img src={authIcon} alt="Auth Icon" />
                </figure>

                <h2>Sign Up</h2>
                <h3>Use your email or phone number to sign up</h3>
              </div>

              <form>
                {url.page == 2 ? (
                  <div>
                    <div>
                      <label htmlFor="">Hint Name</label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Enter Your Name"
                        onChange={userDetailsHandler}
                      />
                    </div>
                    <div>
                      <label htmlFor="gender">Gender</label>
                      <select name="gender" id="gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="dobInputBox">
                      <label htmlFor="id">Date Of Birth</label>
                      <input
                        type="date"
                        id="date"
                        name="dob"
                        onChange={userDetailsHandler}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Location</label>
                      <input
                        type="text"
                        name="location"
                        placeholder="Enter Your Location"
                        onChange={userDetailsHandler}
                      />
                    </div>
                    <div>
                      <button type="button" onClick={() => navigate("/otp")}>
                        Sign Up
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      <label htmlFor="">Name*</label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Enter Your Name"
                        onChange={userDetailsHandler}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Email*</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter Your Email "
                        onChange={userDetailsHandler}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Phone Number*</label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="Enter Your Email "
                        onChange={userDetailsHandler}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => navigate("/signup/2")}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
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

              <form>
                <div className="otp_inputBox">
                  <Flex gap="middle" align="flex-center" vertical>
                    <Input.OTP
                      variant="filled"
                      inputMode="numeric"
                      value={otp}
                      onChange={handleOTPChange}
                      length={4}
                      {...sharedProps}
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
                  <button type="button">Continue</button>
                </div>
              </form>
            </article>
          )}
          {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
          {page === "login" || page === "otp" ? (
            <p>
              Don&apos;t have an account yet?{"  "}
              <span onClick={() => navigate("/signup/1")}>Sign Up</span>
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
