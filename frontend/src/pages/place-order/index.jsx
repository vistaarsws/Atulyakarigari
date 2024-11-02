import React from "react";
import Progress from "../buy-now/Stepper";
import AddressUI from "../user/address/Address";
import Payment from "../buy-now/Payment";
import { Box, useMediaQuery } from "@mui/material";
import DeliveryEstimate from "./DeliveryEstimate";
const PlaceOrder = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  return (
    <div>
      <Progress />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Box sx={{ width: isMobile ? "100%" : "65%" }}>
          <AddressUI />
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "35%",
            height: isMobile ? "" : "89vh",
            overflow: "scroll",
            scrollbarWidth: "none",
          }}
        >
          <DeliveryEstimate />
          <Payment />
        </Box>
      </Box>
    </div>
  );
};

export default PlaceOrder;
