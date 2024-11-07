import React from "react";
import Progress from "../buy-now/Stepper";
import AddressUI from "../user/address/Address";
import Payment from "../buy-now/Payment";
import { Box, useMediaQuery } from "@mui/material";
import DeliveryEstimate from "./DeliveryEstimate";
const PlaceOrder = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  return (
    <Box
      sx={{
        pt: {
          xs: "4vh",
          sm: "0",
        },
      }}
    >
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
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            mb: 2,
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
