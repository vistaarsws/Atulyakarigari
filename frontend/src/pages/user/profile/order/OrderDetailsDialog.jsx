import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  Grid,
  Rating,
  Button,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  StarBorder,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";
import { useEffect } from "react";
import { getShipmentAddress } from "../../../../services/user/userAPI";
import { useSelector } from "react-redux";

export const OrderDetailsDialog = ({
  open,
  handleClose,
  order,
  shiprocketOrderId,
}) => {
  if (!order) return null;
  const { enqueueSnackbar } = useSnackbar();
  const authToken = useSelector((state) => state.auth.token);

  const handleDownloadInvoice = () => {
    enqueueSnackbar("Downloading invoice for order", { variant: "success" });
  };

  const handleReturnOrder = () => {
    enqueueSnackbar("Return request submitted successfully!", {
      variant: "info",
    });
  };

  const handleCancelOrder = () => {
    enqueueSnackbar("Order cancellation request submitted!", {
      variant: "warning",
    });
  };

  useEffect(()=>
  {
   const data =  getShipmentAddress(authToken,shiprocketOrderId);
   console.log(data,"get shipment data");
  },[])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{ mt: "5vh" }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 1, borderBottom: "1px solid #e0e0e0" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Order Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={4}>
          {/* Left Side - Image */}
          <Grid item xs={12} md={5}>
            <img
              src={order?.productDetails?.images[0]}
              alt={order.productDetails?.name}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "contain",
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "8px",
              }}
            />
          </Grid>

          {/* Right Side - Order Details */}
          <Grid item xs={12} md={7}>
            <Stack spacing={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Order Status & Date */}
                <Box>
                  <Typography
                    variant="body2"
                    fontSize={14}
                    color="#60a487"
                    fontWeight={700}
                  >
                    {order?.orderStatus}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontSize={14}
                    color="text.secondary"
                  >
                    {order?.estimatedDelivery
                      ? order?.estimatedDelivery
                      : "Not Available"}
                  </Typography>
                </Box>

                {/* Download Invoice Button */}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadInvoice}
                  sx={{
                    color: "#60a487",
                    borderColor: "#60a487",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#60a487",
                      backgroundColor: "rgba(96, 164, 135, 0.04)",
                    },
                  }}
                >
                  Download Invoice
                </Button>
              </Box>

              <Divider />

              {/* Product Details */}
              <Typography variant="h6" fontWeight={600}>
                {order?.productDetails?.name}
              </Typography>
              <Typography color="text.secondary" fontSize={11} lineHeight={1.6}>
                {order?.productDetails?.description}
              </Typography>

              <Divider />

              {/* Exchange/Return Date */}
              <Typography fontSize={14} color="text.secondary">
                Exchange/Return window closed on {order.exchangeDate}
              </Typography>

              {/* Order Information */}
              <Stack spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                  Order ID:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {order?._id?.orderId}
                  </span>
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  Payment Method:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    {order?.paymentMethod}
                  </span>
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  Shipping Address:
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {order?.shippingAddress?.addressLine1},
                  {order?.shippingAddress?.city},{" "}
                  {order?.shippingAddress?.state} -{" "}
                  {order?.shippingAddress?.postalCode},
                  {order?.shippingAddress?.country},
                </Typography>
                <Typography
                  component={RouterLink} // Making Typography act as a React Router Link
                  to="/profile/trackOrder" // The route to navigate to
                  sx={{ textDecoration: "none", color: "primary.main" }} // Material UI styling
                  fontSize={14}
                >
                  Track Your Order
                </Typography>
              </Stack>

              <Divider />

              {/* Price Breakdown */}
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14}>Subtotal:</Typography>
                  <Typography fontSize={14} fontWeight={600}>
                    ₹{order?._id?.totalPrice}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14}>Discount:</Typography>
                  <Typography fontSize={14} fontWeight={600} color="error">
                    -₹{order?._id?.discountAmount}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14}>Donation</Typography>
                  <Typography fontSize={14} fontWeight={600}>
                    {order?._id?.donationAmount
                      ? order?._id?.donationAmount
                      : "-"}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14}>Tax:</Typography>
                  <Typography fontSize={14} fontWeight={600}>
                    -
                  </Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16} fontWeight={700}>
                    Total:
                  </Typography>
                  <Typography fontSize={16} fontWeight={700}>
                    ₹{order?._id?.totalAmount}
                  </Typography>
                </Box>
              </Stack>

              <Divider />

              {/* Action Buttons */}
              <Box display="flex" justifyContent="space-between">
                {/* Show Return Order button only if order is "Delivered" */}
                {order.status === "Delivered" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReturnOrder}
                    sx={{ textTransform: "none" }}
                  >
                    Return Order
                  </Button>
                )}

                {/* Show Cancel Order button if order is not "Delivered" */}
                {order.status !== "Delivered" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancelOrder}
                    sx={{ textTransform: "none" }}
                  >
                    Cancel Order
                  </Button>
                )}
              </Box>

              {/* Rating Section */}
              <Box>
                <Rating
                  name="product-rating"
                  defaultValue={0}
                  precision={1}
                  emptyIcon={<StarBorder style={{ color: "#d1d5db" }} />}
                />
                <Typography fontSize={14} color="text.secondary">
                  Rate & Review for our artisan's masterpiece
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
