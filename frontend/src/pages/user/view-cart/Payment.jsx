import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../../../utils/helpers";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { fetchCart } from "../../../Redux/features/CartSlice";

const Payment = ({ cartData }) => {
  const navigate = useNavigate();
  const isPlaceOrder = useLocation()?.pathname === "/place-order";
  const location = useLocation();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        boxShadow: isPlaceOrder ? "" : "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        mr: { xs: 0 },
        height: {
          xs: "auto",
        },

        overflow: "hidden",
        scrollbarWidth: "none",
        // my: "10px",
        // borderRadius: 2,
        paddingBottom: isPlaceOrder ? "" : "",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 1,
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
                  defaultChecked
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

          <Box sx={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#383737",
                borderColor: "#e2e2e2",
              }}
            >
              10
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#383737",
                borderColor: "#e2e2e2",
              }}
            >
              20
            </Button>{" "}
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#383737",
                borderColor: "#e2e2e2",
              }}
            >
              50
            </Button>{" "}
            <Button
              variant="outlined"
              sx={{
                borderRadius: "50px",
                fontSize: "14px",
                borderColor: "#e2e2e2",
                fontWeight: 400,
                color: "#383737",
              }}
            >
              100
            </Button>
          </Box>
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
            {cartData?.items > 1
              ? `${cartData.items} items`
              : cartData?.items === 1
                ? `${cartData.items} item`
                : cartData?.items?.length === 1
                  ? `${cartData.items.length} item`
                  : cartData?.items?.length > 1
                    ? `${cartData.items.length} items`
                    : "0 item"}
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
                {formatPrice(cartData?.totalMRP || 0)}
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
                {formatPrice(cartData?.totalDiscount || 0)}
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
          </Box>
        </Box>
        <Divider sx={{ marginY: 3 }} />
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
              {formatPrice(cartData?.total || 0)}
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
                navigate("/place-order");
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
                navigate("/");
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
