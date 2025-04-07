import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";

const TrackingOrder = () => {
  const [orderStatus, setOrderStatus] = useState({
    "795036615": {
      tracking_data: {
        track_status: 0,
        shipment_status: 0,
        shipment_track: [
          {
            id: 0,
            awb_code: "AWB123456789",
            courier_company_id: "DHL",
            shipment_id: 1001,
            order_id: 795036615,
            pickup_date: "2025-03-30",
            delivered_date: "",
            weight: "2.5kg",
            packages: 1,
            current_status: "Out for Delivery",
            delivered_to: "John Doe",
            destination: "New York, USA",
            consignee_name: "John Doe",
            origin: "Los Angeles, USA",
            courier_agent_details: "Agent: Mike, Contact: +1234567890",
            courier_name: "DHL Express",
            edd: "2025-04-10",
            pod: "Available",
            pod_status: "Signed",
            rto_delivered_date: "",
            return_awb_code: "",
            updated_time_stamp: "2025-04-01 14:30:00"
          }
        ],
        shipment_track_activities: null,
        track_url: "",
        qc_response: "",
        is_return: false,
        error: "Aahh! There is no activities found in our DB. Please have some patience it will be updated soon."
      }
    }
  });

  useEffect(() => {}, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return "green";
      case "Pending":
        return "orange";
      case "Delivered":
        return "blue";
      case "In Transit":
        return "purple";
      case "Out for Delivery":
        return "teal";
      default:
        return "gray";
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1300, margin: "auto" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        Track Your Order
      </Typography>

      <Card sx={{ marginBottom: 3, boxShadow: 3, padding: 3, paddingTop: 1 }}>
        <CardContent sx={{ paddingBottom: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Delivery By Atulya Karigari
          </Typography>
        </CardContent>
        <Divider sx={{ marginBottom: 2 }} />

        <CardContent sx={{ paddingTop: 1 }}>
          <Typography variant="h5" gutterBottom>
            Order ID: <strong>795036615</strong>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Tracking ID: <strong>AWB123456789</strong>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Status: {" "}
            <span
              style={{
                color: getStatusColor(orderStatus["795036615"].tracking_data.shipment_track[0].current_status),
                fontWeight: "bold",
              }}
            >
              {orderStatus["795036615"].tracking_data.shipment_track[0].current_status}
            </span>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Estimated Delivery: <strong>2025-04-10</strong>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Pickup Date: {" "}
            <strong>{orderStatus["795036615"].tracking_data.shipment_track[0].pickup_date}</strong>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Origin: <strong>{orderStatus["795036615"].tracking_data.shipment_track[0].origin}</strong>
          </Typography>
          <Typography variant="h5" gutterBottom>
            Destination: {" "}
            <strong>{orderStatus["795036615"].tracking_data.shipment_track[0].destination}</strong>
          </Typography>
        </CardContent>

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            paddingTop: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            Thursday, April 2, 2024
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, fontSize: "1.75rem" }}
            >
              14:30
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 30, width: 4 }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, fontSize: "1.75rem" }}
            >
              Courier Agent: {orderStatus["795036615"].tracking_data.shipment_track[0].courier_agent_details}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TrackingOrder;
