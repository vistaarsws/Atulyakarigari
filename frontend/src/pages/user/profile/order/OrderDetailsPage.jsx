import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Rating,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { StarBorder, Download as DownloadIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import TEST_01 from "../../../../assets/images/order-img.png";
import TEST_02 from "../../../../assets/images/aboutBanner.png";
import TEST_03 from "../../../../assets/images/artistry_1.png";
import TEST_04 from "../../../../assets/images/ourCollections_2.png";

// Sample orders array
const orders = [
  {
    id: 1,
    status: "Pending",
    date: "On Wed, 3 Apr 2024",
    product: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    exchangeDate: "Wed, 10 Apr 2024",
    image: TEST_01,
    subtotal: 20199.99,
    discount: 2020.0,
    paymentMethod: "Cash on Delivery",
    shippingAddress: "John Doe, 123 Main St, Springfield, IL, 62704, USA",
  },
  {
    id: 2,
    status: "Delivered",
    date: "On Wed, 3 Apr 2024",
    product: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    exchangeDate: "Wed, 10 Apr 2024",
    image: TEST_02,
    subtotal: 18999.0,
    discount: 1800.0,
    paymentMethod: "Credit Card (**** 1234)",
    shippingAddress: "John Doe, 123 Main St, Springfield, IL, 62704, USA",
  },
  {
    id: 3,
    status: "Delivered",
    date: "On Wed, 3 Apr 2024",
    product: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    exchangeDate: "Wed, 10 Apr 2024",
    image: TEST_03,
    subtotal: 15499.5,
    discount: 1500.0,
    paymentMethod: "UPI",
    shippingAddress: "John Doe, 123 Main St, Springfield, IL, 62704, USA",
  },
  {
    id: 4,
    status: "Delivered",
    date: "On Wed, 3 Apr 2024",
    product: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    exchangeDate: "Wed, 10 Apr 2024",
    image: TEST_04,
    subtotal: 24999.0,
    discount: 3000.0,
    paymentMethod: "Net Banking",
    shippingAddress: "John Doe, 123 Main St, Springfield, IL, 62704, USA",
  },
];

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // State for modals and inputs
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openReturnModal, setOpenReturnModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState("");
  const [cancelFeedback, setCancelFeedback] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnRating, setReturnRating] = useState(1); // Rating for return, min = 1, max = 3
  const [returnFeedback, setReturnFeedback] = useState(""); // Separate state for return feedback

  useEffect(() => {
    const fetchedOrder = orders.find((order) => order.id === parseInt(orderId));
    if (fetchedOrder) {
      setOrder(fetchedOrder);
    } else {
      enqueueSnackbar("Order not found!", { variant: "error" });
      setOrder(null); // Explicitly set to null to handle "not found" case.
    }
  }, [orderId]);

  const handleDownloadInvoice = () =>
    enqueueSnackbar("Downloading invoice for order", { variant: "success" });

  const handleReturnOrder = () => {
    if (returnRating < 1 || returnRating > 3) {
      enqueueSnackbar("Please provide a rating between 1 and 3", {
        variant: "warning",
      });
      return;
    }
    enqueueSnackbar("Return request submitted successfully!", {
      variant: "info",
    });
    // Close modal and reset state
    setOpenReturnModal(false);
    setReturnReason("");
    setReturnRating(1);
    setReturnFeedback("");
  };

  const handleCancelOrder = () => {
    enqueueSnackbar("Order cancellation request submitted!", {
      variant: "warning",
    });
    // Close modal and reset state
    setOpenCancelModal(false);
    setSelectedCancelReason("");
    setCancelFeedback("");
  };

  const renderPaymentInfo = () => (
    <Stack spacing={1}>
      <Typography fontSize={14} fontWeight={600}>
        Order ID: <span style={{ fontWeight: "normal" }}>#{order.id}</span>
      </Typography>
      <Typography fontSize={14} fontWeight={600}>
        Payment Method:{" "}
        <span style={{ fontWeight: "normal" }}>{order.paymentMethod}</span>
      </Typography>
      <Typography fontSize={14} fontWeight={600}>
        Shipping Address:
      </Typography>
      <Typography fontSize={14} color="text.secondary">
        {order.shippingAddress}
      </Typography>
    </Stack>
  );

  const renderTotal = () => (
    <Stack spacing={1}>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={14}>Subtotal:</Typography>
        <Typography fontSize={14} fontWeight={600}>
          ₹{order.subtotal}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={14}>Discount:</Typography>
        <Typography fontSize={14} fontWeight={600} color="error">
          -₹{order.discount}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={14}>Tax:</Typography>
        <Typography fontSize={14} fontWeight={600}>
          ₹205.99
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={16} fontWeight={700}>
          Total:
        </Typography>
        <Typography fontSize={16} fontWeight={700}>
          ₹{order.subtotal - order.discount + 205.99}
        </Typography>
      </Box>
    </Stack>
  );

  if (!order) {
    return (
      <Box
        sx={{
          p: 4,
          backgroundColor: "#fafafa",
          borderRadius: "8px",
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Order Not Found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        boxShadow: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4" fontWeight={700}>
          Order Details
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={5}>
          <Box sx={{ borderRadius: "8px", overflow: "hidden", boxShadow: 3 }}>
            <img
              src={order.image}
              alt={order.product}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "contain",
                backgroundColor: "#f5f5f5",
                padding: "10px",
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="body2"
                  fontSize={14}
                  color="#60a487"
                  fontWeight={700}
                >
                  {order.status}
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={14}
                  color="text.secondary"
                >
                  {order.date}
                </Typography>
              </Box>

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

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              {order.product}
            </Typography>
            <Typography color="text.secondary" fontSize={13} lineHeight={1.6}>
              {order.description}
            </Typography>

            <Divider sx={{ my: 2 }} />
            <Typography fontSize={14} color="text.secondary">
              Exchange/Return window closed on {order.exchangeDate}
            </Typography>

            {renderPaymentInfo()}
            <Divider sx={{ my: 2 }} />
            {renderTotal()}

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
              {order.status === "Delivered" ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenReturnModal(true)}
                  sx={{ textTransform: "none" }}
                >
                  Return Order
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setOpenCancelModal(true)}
                  sx={{ textTransform: "none" }}
                >
                  Cancel Order
                </Button>
              )}
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Cancel Modal */}
      <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Cancel Reason</InputLabel>
            <Select
              value={selectedCancelReason}
              onChange={(e) => setSelectedCancelReason(e.target.value)}
              label="Cancel Reason"
            >
              <MenuItem value="Product issue">Product issue</MenuItem>
              <MenuItem value="Changed mind">Changed mind</MenuItem>
              <MenuItem value="Better price elsewhere">
                Better price elsewhere
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Additional Feedback"
            fullWidth
            multiline
            rows={3}
            value={cancelFeedback}
            onChange={(e) => setCancelFeedback(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCancelOrder} color="error">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Return Modal */}
      <Dialog open={openReturnModal} onClose={() => setOpenReturnModal(false)}>
        <DialogTitle>Return Order</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Return Reason</InputLabel>
            <Select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              label="Return Reason"
            >
              <MenuItem value="Damaged product">Damaged product</MenuItem>
              <MenuItem value="Wrong item received">
                Wrong item received
              </MenuItem>
              <MenuItem value="Size issue">Size issue</MenuItem>
            </Select>
          </FormControl>
          <Rating
            value={returnRating}
            onChange={(e, newValue) => setReturnRating(newValue)}
            min={1}
            max={5}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Additional Feedback"
            fullWidth
            multiline
            rows={3}
            value={returnFeedback}
            onChange={(e) => setReturnFeedback(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReturnModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReturnOrder} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetailsPage;
