import React from "react";
import OrderCard from "./OrderCard";
import Payment from "./Payment";
import Stepper from "./Stepper";
import AddressComponent from "./AddressComponent";
import { Box, useMediaQuery } from "@mui/material";

const Index = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  return (
    <Box>
      <Stepper />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "2rem",
          // flexDirection: isMobile ? "column" : "row",
          flexDirection: { xs: "column", md: "row" },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            // Add bottom margin on mobile
            mb: { xs: 4, md: 0 },
          }}
        >
          <AddressComponent />
          <OrderCard />
        </Box>
        <Box
          sx={{
            // Full width on mobile, 35% on larger screens
            width: { xs: "100%", md: "35%" },
          }}
        >
          <Payment />
        </Box>{" "}
      </Box>
    </Box>
  );
};

export default Index;
