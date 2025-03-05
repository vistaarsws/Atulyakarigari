import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProfiles } from "../../../Redux/features/ProfileSlice.jsx";
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
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomerDetails from "./CustomerDetails";

export default function Customers() {
  const dispatch = useDispatch();

  // Redux state
  const loading = useSelector((state) => state.profile.loading);
  const customers = useSelector((state) => state.profile.profiles) || []; // Ensure it's always an array

  // Local state
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0 = All Customers, 1 = New Customers

  // Fetch profiles when component mounts
  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);

  // Get the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Filter customers based on the selected tab
  const filteredCustomers = customers.filter((customer) => {
    const name = customer?.fullName?.toLowerCase() || "";
    const email = customer?.email?.toLowerCase() || "";
    const phone = customer?.contactNumber?.toString() || ""; // Convert phone number to string
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      phone.includes(search);

    if (tabValue === 1) {
      // New Customers - created within the last 7 days
      const createdAt = customer?.createdAt
        ? new Date(customer.createdAt)
        : null;
      return createdAt && createdAt >= sevenDaysAgo && matchesSearch;
    }

    return matchesSearch;
  });

  return selectedCustomer ? (
    <CustomerDetails
      customer={selectedCustomer}
      onBack={() => setSelectedCustomer(null)}
    />
  ) : (
    <Box sx={{ p: 3, bgcolor: "#FAF9FF", minHeight: "100vh" }}>
      {/* Header with Total Customers Count */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            bgcolor: "#F0F4FF",
            color: "#1E40AF",
            fontWeight: "bold",
            px: 2,
            py: 1,
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          Total Customers: {filteredCustomers.length}
        </Box>
      </Stack>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mt: 2 }}
      >
        <Tab label="All Customers" />
        <Tab label="New Customers" />
      </Tabs>

      {/* Search Input */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name, email, or phone..."
        size="medium"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2 }}
      />

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#F7F5FF" }}>
              <TableRow>
                <TableCell>CUSTOMER</TableCell>
                <TableCell>PHONE</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>CREATED AT</TableCell>
                <TableCell>TOTAL ORDER</TableCell>
                <TableCell>VIEW</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <TableRow key={customer?.id || customer?.email || index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          src={
                            customer?.profilePicture ||
                            "https://i.pravatar.cc/40"
                          }
                        />
                        {customer?.fullName || "Unknown"}
                      </Box>
                    </TableCell>
                    <TableCell>{customer?.contactNumber || "N/A"}</TableCell>
                    <TableCell>{customer?.email || "N/A"}</TableCell>
                    <TableCell>
                      {customer?.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </TableCell>
                    <TableCell>{customer?.totalOrder || 0}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => setSelectedCustomer(customer)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
