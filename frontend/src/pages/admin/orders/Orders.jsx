import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../../Redux/features/OrderSlice";

const statusColors = {
  Delivered: "success",
  Pending: "warning",
  Cancelled: "error",
  Shipped: "primary",
  Returned: "info",
};

export default function Orders() {
  const [value, setValue] = useState(0);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const statusFilters = ["All", "Delivered", "Pending", "Cancelled", "Returned"];

  const handleChange = useCallback((_, newValue) => setValue(newValue), []);
  const handleRowClick = useCallback((id) => navigate(`/admin/orders/${id}`), [navigate]);

  const handleSearchChange = (e) => setSearch(e.target.value.toLowerCase());

  const authToken = useSelector((state) => state.auth.token);
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(fetchAllOrders(authToken));
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      Object.values(order)
        .some((value) => value?.toString().toLowerCase().includes(search))
    );
  }, [search, orders]);

  const filteredByStatus = useMemo(() => {
    return value === 0
      ? filteredOrders
      : filteredOrders.filter((order) => order.orderStatus === statusFilters[value]);
  }, [value, filteredOrders, statusFilters]);

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", p: 3 }}>
      <Typography variant="h5" fontWeight="bold">Orders</Typography>

      <Tabs value={value} onChange={handleChange} sx={{ mb: 2 }}>
        {statusFilters.map((status, index) => (
          <Tab
            key={index}
            label={`${status} (${orders.filter(o => o.orderStatus === status || status === "All").length})`}
          />
        ))}
      </Tabs>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search orders..."
          size="small"
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f7f7f7" }}>
            <TableRow>
              <TableCell>ORDER ID</TableCell>
              <TableCell>CUSTOMER</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell>STATE</TableCell>
              {!isSmallScreen && <TableCell>ADDRESS</TableCell>}
              <TableCell>DATE</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>PAYMENT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredByStatus.map((order) => (
              <TableRow key={order._id} onClick={() => handleRowClick(order._id)} sx={{ cursor: "pointer" }}>
                <TableCell># {order.orderId}</TableCell>
                <TableCell>{order.shippingAddress?.fullName || "Unknown"}</TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>{order.shippingAddress?.state || "N/A"}</TableCell>
                {!isSmallScreen && <TableCell>{order.shippingAddress?.addressLine1}</TableCell>}
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={order.orderStatus} color={statusColors[order.orderStatus]} />
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
