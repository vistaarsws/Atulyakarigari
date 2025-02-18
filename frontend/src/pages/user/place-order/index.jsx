import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import Progress from "../view-cart/Stepper";
import DeliveryEstimate from "./DeliveryEstimate";
import AddressUI from "../profile/address/Address";
import Payment from "../view-cart/Payment";
import { getCart, getProductById } from "../../../services/user/userAPI"; // Import product fetch function

const PlaceOrder = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const authToken = useSelector((state) => state.auth.token);
  const location = useLocation();
  const productId = location.state?.productId; // Get productId if coming from "Buy Now"
  const productQuantity = location.state?.productQuantity; // Get product quantity if coming from "Buy Now"

  const [cartData, setCartData] = useState(null);

  const fetchOrderData = async () => {
    try {
      if (productId) {
        const response = await getProductById(productId);
        const rate = {
          items: productQuantity,
          totalMRP: response?.data?.data?.priceAfterDiscount * productQuantity,
          totalDiscount:
            (response?.data?.data?.price -
              response?.data?.data?.priceAfterDiscount) *
            productQuantity,
          total: response?.data?.data?.priceAfterDiscount * productQuantity,
        };
        console.log("Rate Data:", rate);
        setCartData(rate);
      } else {
        const response = await getCart();
        setCartData(response?.data?.data);
      }
    } catch (err) {
      console.log("Error fetching order data:", err.message);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [authToken, productId]);
  const orderData = JSON.parse(localStorage.getItem("orderData"));

  return (
    <Box>
      <Progress />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: isMobile ? "column" : "row",
          // height: isMobile ? "" : "83vh",
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100%" : "65%",
          }}
        >
          <AddressUI />
        </Box>
        <Box
          sx={{
            position: "sticky",
            top: "10vh",
            width: isMobile ? "100%" : "35%",
            height: isMobile ? "" : "",
            overflow: "scroll",
            scrollbarWidth: "none",
            // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            borderLeft: "1px solid rgba(99, 99, 99, 0.1)",
            // mb: 2,
          }}
        >
          <DeliveryEstimate orderData={orderData} />
          <Payment orderData={orderData} />
        </Box>
      </Box>
    </Box>
  );
};

export default PlaceOrder;
