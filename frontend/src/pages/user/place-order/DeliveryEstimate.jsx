import React from "react";
import { Box, Typography, CardContent, CardMedia, Stack, Divider } from "@mui/material";
import ORDER_IMG from "../../../assets/images/order-img.png"; // Default fallback image

const DeliveryEstimate = ({ orderData }) => {
  // Extract items safely
  const items = orderData?.products?.items || [];

  return (
    <Box padding={3} sx={{ backgroundColor: "#FAFAFA", borderRadius: 2 }}>
      <Typography sx={{ color: "#333", fontSize: "16px", fontWeight: 600, mb: 2 }}>
        📦 Delivery Estimate
      </Typography>

      {items.length > 0 ? (
        items.map((item, index) => {
          // Get first image from images array, fallback to ORDER_IMG if unavailable
          const productImage = item?.images?.length > 0 ? item.images[0] : ORDER_IMG;

          // Truncate name if it's too long
          const truncatedTitle =
            item?.name?.length > 20 ? item.name.slice(0, 20) + "..." : item?.name || "Product";

          return (
            <Box
              key={item._id || index}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 2,
                backgroundColor: "#FFFFFF",
                borderRadius: 2,
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
                mb: 2,
              }}
            >
              {/* Product Image */}
              <CardMedia
                component="img"
                sx={{ width: 55, height: 65, borderRadius: 1, objectFit: "cover" }}
                image={productImage}
                alt={truncatedTitle}
              />

              {/* Product Details */}
              <Stack spacing={0.5} sx={{ flexGrow: 1, ml: 2 }}>
                <Typography sx={{ fontWeight: 500, fontSize: "13px", color: "#333" }}>
                  {truncatedTitle}
                </Typography>

                {/* Quantity & Price */}
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: "12px", color: "#666" }}>
                    QTY {item?.quantity || 1}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#000" }}>
                    ₹{item?.priceAfterDiscount || item?.price || 0}
                  </Typography>
                </Stack>

                {/* Delivery Date */}
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ fontSize: "12px", color: "#388E3C", fontWeight: 500 }}>
                  🚚 Delivery by <strong>5 Oct - 7 Oct</strong>
                </Typography>
              </Stack>
            </Box>
          );
        })
      ) : (
        <Typography sx={{ fontSize: "14px", color: "#666", textAlign: "center", mt: 2 }}>
          No items found.
        </Typography>
      )}
    </Box>
  );
};

export default DeliveryEstimate;
