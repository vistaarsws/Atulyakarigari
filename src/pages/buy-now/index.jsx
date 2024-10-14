import React from "react";
import OrderCard from "./OrderCard";
import Payment from "./Payment";
import Stepper from "./Stepper";
import AddressComponent from "./AddressComponent";
import { useMediaQuery } from "@mui/material";

const Index = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  return (
    <div>
      <Stepper />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "2rem",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div
          style={{
            // border: "2px solid blue",
            marginLeft: "1rem",
          }}
        >
          <AddressComponent />
          <OrderCard />
        </div>
        <Payment />
      </div>
    </div>
  );
};

export default Index;
