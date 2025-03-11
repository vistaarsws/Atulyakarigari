import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";

const statusColors = {
  Delivered: "success",
  Pending: "warning",
  Cancelled: "error",
  Shipped: "primary",
  Returned: "info",
};

export default function OrderDetails() {
  const { id } = useParams();
  const orders = useSelector((state) => state.orders.orders);
  const order = orders.find((o) => o._id === id);

  if (!order) return <Typography>Order not found!</Typography>;

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", p: 3 }}>
      <Typography variant="h5">
        Orders / Order details: <b>#{order.orderId}</b>
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Typography variant="h6">{order.shippingAddress?.fullName}</Typography>
        <Chip
          label={order.orderStatus}
          color={statusColors[order.orderStatus]}
          sx={{ ml: 2, fontWeight: "bold" }}
        />
      </Box>

      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body1"><b>State:</b> {order.shippingAddress?.state}</Typography>
        <Typography variant="body1"><b>Address:</b> {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}</Typography>
        <Typography variant="body1"><b>Order Date:</b> {new Date(order.createdAt).toLocaleDateString()}</Typography>
        <Typography variant="body1"><b>Payment:</b> {order.paymentMethod}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>Products Ordered</Typography>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PRODUCT</TableCell>
              <TableCell>QUANTITY</TableCell>
              <TableCell>PRICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>₹{product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
