import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
} from "@mui/material";
import ORDER_IMG from "../../assets/images/order-img.png";

const items = [
  {
    id: 1,
    imageUrl: ORDER_IMG,
    title: "BANARSI SAARI",
    quantity: 1,
    price: 27000,
    deliveryDate: "5 Oct - 7 Oct",
  },
  {
    id: 2,
    imageUrl: ORDER_IMG,
    title: "BANARSI SAARI",
    quantity: 1,
    price: 27000,
    deliveryDate: "5 Oct - 7 Oct",
  },
  {
    id: 3,
    imageUrl: ORDER_IMG,
    title: "BANARSI SAARI",
    quantity: 1,
    price: 27000,
    deliveryDate: "5 Oct - 7 Oct",
  },
];

const DeliveryEstimate = () => {
  return (
    <Box padding={2}>
      <Typography
        sx={{ color: "#6F6F6F", fontSize: "14px", fontWeight: 400, mb: 2 }}
      >
        Delivery Estimate
      </Typography>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            mb: 2,
            alignItems: "center",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 1px",
            // border: "2px solid red",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "42px",
              height: "52px",
            }}
            image={item.imageUrl}
            alt={item.title}
          />

          <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
            <CardContent>
              <Typography
                sx={{ fontWeight: 400, fontSize: "12px", color: "#383737" }}
              >{`${item.title}, QTY ${item.quantity}, ${item.price}`}</Typography>
            </CardContent>
            <Box sx={{ padding: 1, textAlign: "right", flexGrow: 1 }}>
              <Typography
                sx={{ fontWeight: 400, fontSize: "12px", color: "#383737" }}
              >
                Delivery by{" "}
                <strong style={{ fontWeight: 800 }}>{item.deliveryDate}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default DeliveryEstimate;
