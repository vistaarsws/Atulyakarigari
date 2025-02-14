import { useState, useMemo, useCallback } from "react";
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

const orders = [
  { id: "868489", customer: "Aditi Kumari Singh", total: "27,000", state: "Bhopal", address: "House no. 140 puja shree nagar...", date: "02/10/2024", status: "Delivered", payment: "Online - Paytm" },
  { id: "868490", customer: "John Doe", total: "30,000", state: "Delhi", address: "Street 21, Block B...", date: "03/10/2024", status: "Pending", payment: "Online - UPI" },
  { id: "868491", customer: "Michael Smith", total: "15,500", state: "Mumbai", address: "Sector 9, Andheri East...", date: "04/10/2024", status: "Cancelled", payment: "Credit Card" },
  { id: "868492", customer: "Priya Sharma", total: "22,750", state: "Chennai", address: "Near Anna Salai...", date: "05/10/2024", status: "Shipped", payment: "COD" },
  { id: "868493", customer: "David Johnson", total: "18,000", state: "Kolkata", address: "Salt Lake, Sector 5...", date: "06/10/2024", status: "Returned", payment: "Online - Net Banking" },
];

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
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  // Status filter tabs
  const statusFilters = ["All", "Delivered", "Pending", "Cancelled", "Returned"];

  // Handle Tab Change
  const handleChange = useCallback((_, newValue) => setValue(newValue), []);

  // Handle Row Click
  const handleRowClick = useCallback((id) => navigate(`/admin/orders/${id}`), [navigate]);

  // Debounce Search Input
  const handleSearchChange = useCallback((e) => {
    setTimeout(() => setSearch(e.target.value), 300);
  }, []);

  // Filter Orders (useMemo to optimize re-renders)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      Object.values(order).some((value) => value.toString().toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const filteredByStatus = useMemo(() => {
    return value === 0 ? filteredOrders : filteredOrders.filter((order) => order.status === statusFilters[value]);
  }, [value, filteredOrders, statusFilters]);

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", p: 3 }}>
      <Typography variant="h5" fontWeight="bold">Orders</Typography>

      <Tabs value={value} onChange={handleChange} sx={{ mb: 2 }}>
        {statusFilters.map((status, index) => (
          <Tab key={index} label={`${status} (${orders.filter(o => o.status === status || status === "All").length})`} />
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
              <TableRow key={order.id} onClick={() => handleRowClick(order.id)} sx={{ cursor: "pointer" }}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>₹{order.total}</TableCell>
                <TableCell>{order.state}</TableCell>
                {!isSmallScreen && <TableCell>{order.address}</TableCell>}
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Chip label={order.status} color={statusColors[order.status]} />
                </TableCell>
                <TableCell>{order.payment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
