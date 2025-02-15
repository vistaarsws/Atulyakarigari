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

const orders = [
  {
    id: "868489",
    customer: "Aditi Kumari Singh",
    customerId: "927846",
    state: "Bhopal",
    address: "House no. 140, Puja Shree Nagar...",
    date: "02/10/2024",
    status: "Delivered",
    payment: "Online - Paytm",
    products: [
      {
        title: "Banarasi Nikhar Silk Saree",
        category: "Handloom",
        quantity: 1,
        attributes: { color: "Yellow", size: "5.5m" },
        date: "12 Sep 2024",
        price: "12,000",
        originalPrice: "20,000",
      },
      {
        title: "Handcrafted Jute Bag",
        category: "Accessories",
        quantity: 2,
        attributes: { color: "Brown", size: "Medium" },
        date: "10 Sep 2024",
        price: "3,000",
        originalPrice: "4,000",
      },
    ],
    subtotal: "28,200",
    discount: "-1,200",
    total: "27,000",
  },
  {
    id: "868490",
    customer: "John Doe",
    customerId: "926534",
    state: "Delhi",
    address: "Street 21, Block B...",
    date: "03/10/2024",
    status: "Pending",
    payment: "Online - UPI",
    products: [
      {
        title: "Casual Cotton Kurta",
        category: "Clothing",
        quantity: 1,
        attributes: { color: "Blue", size: "L" },
        date: "15 Sep 2024",
        price: "1,500",
        originalPrice: "2,000",
      },
      {
        title: "Leather Wallet",
        category: "Accessories",
        quantity: 1,
        attributes: { color: "Black", size: "Standard" },
        date: "16 Sep 2024",
        price: "2,500",
        originalPrice: "3,000",
      },
    ],
    subtotal: "30,500",
    discount: "-500",
    total: "30,000",
  },
  {
    id: "868491",
    customer: "Michael Smith",
    customerId: "924789",
    state: "Mumbai",
    address: "Sector 9, Andheri East...",
    date: "04/10/2024",
    status: "Cancelled",
    payment: "Credit Card",
    products: [
      {
        title: "Formal Blazer",
        category: "Clothing",
        quantity: 1,
        attributes: { color: "Grey", size: "M" },
        date: "18 Sep 2024",
        price: "8,500",
        originalPrice: "12,000",
      },
      {
        title: "Silk Tie",
        category: "Accessories",
        quantity: 2,
        attributes: { color: "Maroon", size: "Standard" },
        date: "20 Sep 2024",
        price: "3,500",
        originalPrice: "5,000",
      },
    ],
    subtotal: "16,000",
    discount: "-500",
    total: "15,500",
  },
  {
    id: "868492",
    customer: "Priya Sharma",
    customerId: "923678",
    state: "Chennai",
    address: "Near Anna Salai...",
    date: "05/10/2024",
    status: "Shipped",
    payment: "COD",
    products: [
      {
        title: "Kanjivaram Silk Saree",
        category: "Handloom",
        quantity: 1,
        attributes: { color: "Green", size: "6m" },
        date: "22 Sep 2024",
        price: "15,000",
        originalPrice: "25,000",
      },
      {
        title: "Handmade Clutch Bag",
        category: "Accessories",
        quantity: 1,
        attributes: { color: "Golden", size: "Small" },
        date: "23 Sep 2024",
        price: "8,000",
        originalPrice: "10,000",
      },
    ],
    subtotal: "23,000",
    discount: "-250",
    total: "22,750",
  },
  {
    id: "868493",
    customer: "David Johnson",
    customerId: "922345",
    state: "Kolkata",
    address: "Salt Lake, Sector 5...",
    date: "06/10/2024",
    status: "Returned",
    payment: "Online - Net Banking",
    products: [
      {
        title: "Denim Jacket",
        category: "Clothing",
        quantity: 1,
        attributes: { color: "Blue", size: "XL" },
        date: "25 Sep 2024",
        price: "5,000",
        originalPrice: "7,000",
      },
      {
        title: "Running Shoes",
        category: "Footwear",
        quantity: 1,
        attributes: { color: "Black", size: "10" },
        date: "26 Sep 2024",
        price: "13,000",
        originalPrice: "15,000",
      },
    ],
    subtotal: "18,500",
    discount: "-500",
    total: "18,000",
  },
];


const statusColors = {
  Delivered: "success",
  Pending: "warning",
  Cancelled: "error",
  Shipped: "primary",
  Returned: "info",
};

export default function OrderDetails() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order) return <Typography>Order not found!</Typography>;

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", p: 3 }}>
      <Typography variant="h5">
        Orders / Order details: <b>#{id}</b>
      </Typography>

      {/* Customer and Order Status */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Typography variant="h6">{order.customer}</Typography>
        <Chip
          label={order.status}
          color={statusColors[order.status]}
          sx={{ ml: 2, fontWeight: "bold" }}
        />
      </Box>

      {/* Order Information */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="body1"><b>State:</b> {order.state}</Typography>
        <Typography variant="body1"><b>Address:</b> {order.address}</Typography>
        <Typography variant="body1"><b>Order Date:</b> {order.date}</Typography>
        <Typography variant="body1"><b>Payment:</b> {order.payment}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Product Details */}
      <Typography variant="h6" sx={{ mb: 2 }}>Products Ordered</Typography>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PRODUCT</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>QUANTITY</TableCell>
              <TableCell>ATTRIBUTES</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>PRICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>Color: {product.attributes.color}, Size: {product.attributes.size}</TableCell>
                <TableCell>{product.date}</TableCell>
                <TableCell>₹{product.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Summary */}
      <Box sx={{ mt: 3, p: 2, bgcolor: "#f7f7f7", borderRadius: 1 }}>
        <Typography variant="body1"><b>Subtotal:</b> ₹{order.subtotal}</Typography>
        <Typography variant="body1"><b>Discount:</b> ₹{order.discount}</Typography>
        <Typography variant="h6"><b>Total:</b> ₹{order.total}</Typography>
      </Box>
    </Box>
  );
}
