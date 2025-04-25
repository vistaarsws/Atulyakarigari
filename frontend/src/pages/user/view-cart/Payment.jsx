import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useHref, useLocation, useNavigate } from "react-router-dom";
const CCAVENUE_WORKING_KEY = import.meta.env.VITE_CCAVENUE_WORKING_KEY;
const CCAVENUE_MERCHANT_ID = import.meta.env.VITE_CCAVENUE_MERCHANT_ID;
const CCAVENUE_ACCESS_CODE = import.meta.env.VITE_CCAVENUE_ACCESS_CODE;
import { formatPrice } from "../../../utils/helpers";
import { useState, useEffect } from "react";
import { createOrder, createPayment } from "../../../services/user/userAPI";
import { useSelector } from "react-redux";
import CCAvenue from "../../../utils/CcavenuePay/CCAvenue";
import toast from "react-hot-toast";
import { getAddress } from "../../../services/user/userAPI";
// import { logPageView } from "../../../utils/analytics/analytics";
const Payment = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const cartData =
    buyNowItem?.length == 1 ? buyNowItem : useSelector((state) => state.cart);
  const { profile } = useSelector((state) => state.profile);

  const selectedAddressID = useSelector(
    (state) => state.address.selectedAddressID
  );
  const isPlaceOrder = useLocation()?.pathname === "/place-order";
  const [selectedDonation, setSelectedDonation] = useState(0);
  const [isDonationEnabled, setIsDonationEnabled] = useState(true);
  const [address, setAddress] = useState();

  const donationAmounts = [0, 10, 20, 50, 100];
  const authToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    const savedDonation = JSON.parse(localStorage.getItem("selectedDonation"));
    if (savedDonation) {
      setSelectedDonation(savedDonation);
    }
    console.log(authToken, "authToken");
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const { data } = await getAddress();
      if (data.data) {
        setAddress(data.data);
      }
    };
    fetchAddress();
  }, []);

  // useEffect(() => {
  //   const location = useLocation();

  //   logPageView(location.pathname);
  // }, []);

  const handleDonationSelect = (amount) => {
    setSelectedDonation(amount);
    localStorage.setItem("selectedDonation", JSON.stringify(amount));
  };

  const totalAmount = isDonationEnabled
    ? cartData?.total + (selectedDonation || 0) || 0
    : cartData?.total || 0;

  const totalAmountOfSingleProduct = isDonationEnabled
    ? cartData?.price + (selectedDonation || 0) || 0
    : cartData?.total || 0;

  const handlePayment = async () => {
    console.log(CCAVENUE_WORKING_KEY, "text");
    const host = "http://localhost:3000";

    let paymentData = {
      merchant_id: CCAVENUE_MERCHANT_ID,
      order_id: "ORD123", // Order ID - It can be generated from our project
      amount: "50", // Payment Amount (Required)
      currency: "INR", // Payment Currency Type (Required)
      billing_email: "johndoe@gmail.com", // Billing Email (Optional)
      billing_name: "John Doe", // Billing Name (Optional)
      billing_address: "Address Details", // Billing Address (Optional)
      billing_city: "Ahmedabad", // Billing City (Optional)
      billing_state: "Gujarat", // Billing State (Optional)
      billing_zip: "380002", // Billing Zip (Optional)
      billing_country: "India", // Billing Country (Optional)
      redirect_url: `${host}/api/ccavenue-handle`, // Success URL (Required)
      cancel_url: `${host}/api/ccavenue-handle`, // Failed/Cancel Payment URL (Required)
      merchant_param1: "Extra Information", // Extra Information (Optional)
      merchant_param2: "Extra Information", // Extra Information (Optional)
      merchant_param3: "Extra Information", // Extra Information (Optional)
      merchant_param4: "Extra Information", // Extra Information (Optional)
      language: "EN", // Language (Optional)
      billing_tel: "1234567890", // Billing Mobile Number (Optional)
    };

    try {
      // Wait for the encryption to complete
      let encReq = await CCAvenue.getEncryptedOrder(paymentData);
      let accessCode = CCAVENUE_ACCESS_CODE;

      // Constructing the URL for payment redirection
      let URL = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${paymentData.merchant_id}&encRequest=${encReq}&access_code=${accessCode}`;

      // Opening the payment page in a new tab
      window.open(URL, "_blank");
    } catch (error) {
      console.error("Error encrypting payment data:", error);
    }
    orderCreate();
  };

  const orderCreate = async () => {
    try {
      const data = await createOrder("ORD-5828423686");
      toast.success("Order Created Successfully!", {
        duration: 5000,
      });
      navigate("/profile/orders");
      console.log(
        "Order created successfully!",
        data.data.order.shiprocketOrderId
      );
      console.log("order create", data);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  console.log(cartData.items, "hi", profile, "hello", address);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        // boxShadow: isPlaceOrder ? "" : "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        mr: { xs: 0 },

        // overflow: "scroll",
        scrollbarWidth: "none",
        // my: "10px",
        // borderRadius: 2,
        paddingBottom: isPlaceOrder ? "" : "",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          // boxShadow: 1,
          padding: { xs: 2, md: 4 },
          width: "100%",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              color: "rgba(111, 111, 111, 1)",
              lineHeight: "25px",
            }}
          >
            Support Hardworking Artisans In India
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isDonationEnabled}
                  onChange={() => {
                    setIsDonationEnabled(!isDonationEnabled);
                    if (!isDonationEnabled) {
                      setSelectedDonation(0);
                    }
                  }}
                  size="large"
                  sx={{
                    color: "rgb(56, 55, 55)",
                    "&.Mui-checked": {
                      color: "#60a487",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: 16,
                      boxShadow: "none",
                    },
                  }}
                />
              }
              label="Donate and make a difference"
              sx={{
                ".MuiFormControlLabel-label": {
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "25px",
                  color: "rgb(56, 55, 55)",
                },
              }}
            />
          </Box>

          {isDonationEnabled && (
            <Box
              sx={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}
            >
              {donationAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={
                    selectedDonation === amount ? "contained" : "outlined"
                  }
                  sx={{
                    borderRadius: "50px",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: selectedDonation === amount ? "white" : "#383737",
                    backgroundColor:
                      selectedDonation === amount ? "#60a487" : "transparent",
                    borderColor: "#e2e2e2",
                    "&:hover": {
                      backgroundColor: "#60a487",
                      color: "white",
                    },
                  }}
                  onClick={() => handleDonationSelect(amount)}
                >
                  {amount}
                </Button>
              ))}
            </Box>
          )}
        </Box>
        <Divider sx={{ marginY: 3 }} />
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "25px",
              color: "rgba(56, 55, 55, 1)",
            }}
          >
            Price Details (
            {cartData?.items?.items > 1
              ? `${cartData?.items} items`
              : cartData?.items === 1
                ? `${cartData?.items} item`
                : cartData.items?.length === 1
                  ? `${cartData?.items?.length} item`
                  : cartData?.items?.length > 1
                    ? `${cartData?.items?.length} items`
                    : "1 item"}
            )
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Total MRP
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(56, 55, 55, 1)",
                  lineHeight: "25px",
                }}
              >
                {formatPrice(
                  cartData?.items?.length > 0
                    ? cartData?.totalMRP
                    : (cartData[0]?.price ?? 0)
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Discount on MRP
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(96, 164, 135, 1)",
                  lineHeight: "25px",
                }}
              >
                {/* {formatPrice(cartData?.totalDiscount || 0)} */}
                {"- "}
                {formatPrice(
                  cartData?.items?.length > 0
                    ? cartData?.totalDiscount
                    : (cartData[0]?.price ?? 0) - (cartData[0]?.priceAfterDiscount ?? 0)
                )}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Coupon Discount
              </Typography>
              <Typography
                sx={{
                  color: "rgba(173, 63, 56, 1)",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "25px",
                }}
              >
                Apply Coupon
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "rgba(111, 111, 111, 1)",
                  lineHeight: "25px",
                }}
              >
                Shipping Fee
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "12px",
                  color: "rgba(96, 164, 135, 1)",
                  lineHeight: "25px",
                }}
              >
                Free
              </Typography>
            </Box>
            {isDonationEnabled && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  marginTop: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "rgba(111, 111, 111, 1)",
                    lineHeight: "25px",
                  }}
                >
                  Donation for Artisans
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "rgba(96, 164, 135, 1)",
                    lineHeight: "25px",
                  }}
                >
                  {formatPrice(selectedDonation)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Divider sx={{ marginY: useMediaQuery("(max-width:768px)") ? 1 : 3 }} />
        <Box sx={{ marginBottom: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(56, 55, 55, 1)",
                lineHeight: "25px",
              }}
            >
              Total Amount
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "14px",
                color: "rgba(56, 55, 55, 1)",
                lineHeight: "25px",
              }}
            >
              {/* {formatPrice(totalAmount)} */}
              {formatPrice(
                cartData?.items?.length > 0
                  ? totalAmount
                  : totalAmountOfSingleProduct
              )}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            position: useMediaQuery("(max-width:900px)") ? "fixed" : "relative",
            left: "50%",
            bottom: "0",
            transform: "translateX(-50%)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "white",
            zIndex: 9999,
            paddingBottom: "1rem",
            paddingInline: useMediaQuery("(max-width:900px)") ? "1.6rem" : "",
          }}
        >
          {location.pathname === "/view-cart" && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgba(96, 164, 135, 1)",
                color: "white",
                paddingY: 1.5,
                borderRadius: 1,
                textTransform: "capitalize",
                fontSize: "16px",
                fontWeight: 400,
                position: "relative",
                width: "100%",
              }}
              onClick={() => {
                navigate("/place-order", cartData.items);
              }}
            >
              Place Order
            </Button>
          )}

          {location.pathname === "/place-order" && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgba(96, 164, 135, 1)",
                color: "white",
                paddingY: 1.5,
                borderRadius: 1,
                textTransform: "capitalize",
                fontSize: "16px",
                fontWeight: 400,
                position: "relative",
                width: "100%",
              }}
              onClick={() => {
                handlePayment();
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default Payment;
