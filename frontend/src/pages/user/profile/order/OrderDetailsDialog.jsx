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
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  StarBorder,
  Download as DownloadIcon,
  Bolt,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

export const OrderDetailsDialog = ({ open, handleClose, order }) => {
  if (!order) return null;
  const { enqueueSnackbar } = useSnackbar();

  const handleDownloadInvoice = () => {
    enqueueSnackbar("Downloading invoice for order", {
      variant: "success",
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{ mt: "5vh" }}>
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
                src={order.image}
                alt={order.product}
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
          <Grid item xs={12} md={7} >
            <Stack spacing={2}>
              <Box  sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "50vh",
                }}>

              {/* Order Status & Date */}
              <Box>
                <Typography variant="body2" fontSize={14} color="#60a487" fontWeight={700}>
                  {order.status}
                </Typography>
                <Typography variant="body2" fontSize={14} color="text.secondary">
                  {order.date}
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
                {order.product}
              </Typography>
              <Typography color="text.secondary" fontSize={11} lineHeight={1.6}>
                {order.description}
              </Typography>

              <Divider />

              {/* Exchange/Return Date */}
              <Typography fontSize={14} color="text.secondary">
                Exchange/Return window closed on {order.exchangeDate}
              </Typography>

              {/* Order Information */}
              <Stack spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                  Order ID: <span style={{ fontWeight: "normal" }}>#12345678</span>
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  Payment Method: <span style={{ fontWeight: "normal" }}>Credit Card (**** 1234)</span>
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  Shipping Address:
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  John Doe, 123 Main St, Springfield, IL, 62704, USA
                </Typography>
              </Stack>

              <Divider />

              {/* Price Breakdown */}
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14}>Subtotal:</Typography>
                  <Typography fontSize={14} fontWeight={600}>₹20199.99</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14}>Discount:</Typography>
                  <Typography fontSize={14} fontWeight={600} color="error">-₹2020.00</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={14}>Tax:</Typography>
                  <Typography fontSize={14} fontWeight={600}>₹205.99</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography fontSize={16} fontWeight={700}>Total:</Typography>
                  <Typography fontSize={16} fontWeight={700}>₹20185.98</Typography>
                </Box>
              </Stack>

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
