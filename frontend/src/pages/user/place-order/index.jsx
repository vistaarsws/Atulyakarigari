import React from "react";
import Progress from "../buy-now/Stepper";
import { Box, useMediaQuery } from "@mui/material";
import DeliveryEstimate from "./DeliveryEstimate";
import AddressUI from "../profile/address/Address";
import Payment from "../buy-now/Payment";
const PlaceOrder = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
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
        <Box sx={{ width: isMobile ? "100%" : "65%" }}>
          <AddressUI />
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "35%",
            height: isMobile ? "" : "83.5vh",
            overflow: "scroll",
            scrollbarWidth: "none",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            // mb: 2,
          }}
        >
          <DeliveryEstimate />
          <Payment />
        </Box>
      </Box>
    </Box>
  );
};

export default PlaceOrder;
