// import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, useMediaQuery } from "@mui/material";
import Progress from "../view-cart/Stepper";
import DeliveryEstimate from "./DeliveryEstimate";
import AddressUI from "../profile/address/Address";
import Payment from "../view-cart/Payment";
// import { getCart, getProductById } from "../../../services/user/userAPI";

const PlaceOrder = () => {
  // const dispatch = useDispatch();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:900px)");
  // const authToken = useSelector((state) => state.auth.token);
  const productId = location.state?.productId; 
  const products = useSelector((state) => state.products.products);
  const buyNowItem = products.filter((item) => item._id == productId);

  // const [cartData, setCartData] = useState(null);

  // useEffect(() => {
  //   const fetchOrderData = async () => {
  //     try {
  //       if (productId) {
  //         // Fetch single product data for Buy Now
  //         const response = await getProductById(productId);
  //         const product = response?.data?.data;
  //         const orderData = {
  //           items: [
  //             {
  //               productId: productId,
  //               name: product?.name,
  //               quantity: 1,
  //               price: product?.priceAfterDiscount,
  //             },
  //           ],
  //           totalMRP: product?.priceAfterDiscount,
  //           totalDiscount: product?.price - product?.priceAfterDiscount,
  //           total: product?.priceAfterDiscount,
  //         };
  //         setCartData(orderData);
  //       } else {
  //         // Fetch entire cart when coming from View Cart
  //         const response = await getCart();
  //         setCartData(response?.data?.data);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching order data:", err.message);
  //     }
  //   };

  //   fetchOrderData();
  // }, [productId]); // Runs only when productId changes

  return (
    <Box>
      <Progress />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Left Section - Address */}
        <Box sx={{ width: isMobile ? "100%" : "65%" }}>
          <AddressUI />
        </Box>

        {/* Right Section - Order Summary */}
        <Box
          sx={{
            position: "sticky",
            top: "10vh",
            width: isMobile ? "100%" : "35%",
            overflow: "scroll",
            scrollbarWidth: "none",
            borderLeft: "1px solid rgba(99, 99, 99, 0.1)",
          }}
        >
          <DeliveryEstimate buyNowItem={buyNowItem} />
          <Payment buyNowItem={buyNowItem} />
        </Box>
      </Box>
    </Box>
  );
};

export default PlaceOrder;
