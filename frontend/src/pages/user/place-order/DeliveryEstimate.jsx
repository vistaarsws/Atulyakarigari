import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, CardMedia, Stack, Divider, CircularProgress } from "@mui/material";
import { getAddress, getServiceability } from "../../../services/user/userAPI";
import ORDER_IMG from "../../../assets/images/order-img.png";

const DeliveryEstimate = () => {
  const dispatch = useDispatch();
  const selectedAddressID = useSelector((state) => state.address.selectedAddressID);
  const cartData = useSelector((state) => state.cart);

  const [deliveryEstimations, setDeliveryEstimations] = useState({});
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [loading, setLoading] = useState(true);
  const items = cartData?.items || [];

  const fetchAddressAndServiceability = useCallback(async () => {
    try {
      setLoading(true);
      let pincode = "";

      const addressResponse = await getAddress();
      const allAddresses = Object.values(addressResponse?.data?.data || {});

      const matchedAddress = allAddresses.find((addr) => addr._id === selectedAddressID);
      pincode = matchedAddress ? matchedAddress.pincode : allAddresses[0]?.pincode || "";

      if (!pincode) return;

      setDeliveryPincode(pincode);

      const newEstimations = {};
      await Promise.all(
        items.map(async (item) => {
          try {
            const response = await getServiceability(item.productId, pincode, false);
            newEstimations[item.productId] =
              response?.data?.message?.fastest_delivery?.estimated_delivery || "Unavailable";
          } catch {
            newEstimations[item.productId] = "Unavailable";
          }
        })
      );

      setDeliveryEstimations(newEstimations);
    } catch {
      // Handle errors silently in production
    } finally {
      setLoading(false);
    }
  }, [items, selectedAddressID]);

  useEffect(() => {
    if (items.length > 0) {
      fetchAddressAndServiceability();
    }
  }, [items, selectedAddressID, fetchAddressAndServiceability]);

  return (
    <Box padding={3} sx={{ backgroundColor: "#FAFAFA", borderRadius: 2 }}>
      <Typography sx={{ color: "#333", fontSize: "16px", fontWeight: 600, mb: 2 }}>
        📦 Delivery Estimate
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size={24} />
        </Box>
      ) : items.length > 0 ? (
        items.map((item, index) => (
          <Box
            key={item.productId || index}
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
              image={item?.images?.[0] || ORDER_IMG}
              alt={item?.name || "Product"}
            />

            {/* Product Details */}
            <Stack spacing={0.5} sx={{ flexGrow: 1, ml: 2 }}>
              <Typography sx={{ fontWeight: 500, fontSize: "13px", color: "#333" }}>
                {item?.name?.length > 20 ? `${item.name.slice(0, 20)}...` : item?.name || "Product"}
              </Typography>

              {/* Quantity & Price */}
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: "12px", color: "#666" }}>QTY {item?.quantity || 1}</Typography>
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#000" }}>
                  ₹{item.price * item.quantity}
                </Typography>
              </Stack>

              {/* Delivery Date */}
              <Divider sx={{ my: 1 }} />
              <Typography sx={{ fontSize: "12px", color: "#388E3C", fontWeight: 500 }}>
                🚚 Delivery by <strong>{deliveryEstimations[item.productId] || "Checking..."}</strong>
              </Typography>
            </Stack>
          </Box>
        ))
      ) : (
        <Typography sx={{ fontSize: "14px", color: "#666", textAlign: "center", mt: 2 }}>
          No items found.
        </Typography>
      )}
    </Box>
  );
};

export default DeliveryEstimate;
