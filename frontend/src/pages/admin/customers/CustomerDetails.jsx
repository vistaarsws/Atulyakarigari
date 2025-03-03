import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Avatar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";

export default function CustomerDetails({ customer, onBack }) {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ p: 3, bgcolor: "#FAF9FF", minHeight: "100vh" }}>
      {/* Back Button */}
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Back to Customers
      </Button>

      {/* Customer Info & Stats */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={customer?.profilePicture || "https://i.pravatar.cc/80"} sx={{ width: 60, height: 60 }} />
            <Box>
              <Typography fontWeight="bold">{customer?.fullName || "Unknown"}</Typography>
              <Typography fontSize={14} color="text.secondary">{customer?.email || "N/A"}</Typography>
              <Typography fontSize={14} color="text.secondary">
                <strong>Phone:</strong> {customer?.contactNumber || "N/A"}
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                <strong>Address:</strong> {customer?.address || "House No. 140, Unknown"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#F2FFF4" }}>
                <Typography fontWeight="bold" variant="h6">Total Cost</Typography>
                <Typography fontSize={20}>{customer?.payment || "₹0"}</Typography>
                <Typography color="green" fontSize={12}>Last Payment was ₹300</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#EDF7FA" }}>
                <Typography fontWeight="bold" variant="h6">Total Orders</Typography>
                <Typography fontSize={20}>{customer?.orders?.length || 0}</Typography>
                <Typography color="blue" fontSize={12}>3 - Weekly Avg</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#FDEDED", border: "1px solid #D32F2F" }}>
                <Typography fontWeight="bold" variant="h6">Pending Payment</Typography>
                <Typography fontSize={20}>{customer?.pendingPayment || "₹0"}</Typography>
                <Typography color="red" fontSize={12}>Last: 26 Nov 2023</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mt: 3 }}>
        <Tab label={`Orders (${customer?.orders?.length || 0})`} />
        <Tab label="Wishlist (421)" />
      </Tabs>

      {/* Orders Table */}
      <Paper sx={{ mt: 2, p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#F7F5FF" }}>
              <TableRow>
                <TableCell>ORDER ID</TableCell>
                <TableCell>PAYMENT</TableCell>
                <TableCell>PAYMENT MODE</TableCell>
                <TableCell>ADDRESS DELIVERED</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>INVOICE</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell>RATINGS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer?.orders?.length > 0 ? (
                customer.orders.map((order) => (
                  <TableRow key={order?.id || Math.random()}>
                    <TableCell>#{order?.id || "N/A"}</TableCell>
                    <TableCell>{order?.payment || "N/A"}</TableCell>
                    <TableCell>{order?.paymentMode || "--"}</TableCell>
                    <TableCell>{order?.address || "House No. 140, Puja Nagar..."}</TableCell>
                    <TableCell>{order?.date || "02/10/2024"}</TableCell>
                    <TableCell sx={{ color: "blue", cursor: "pointer" }}>Invoice</TableCell>
                    <TableCell>
                      <Chip
                        label={order?.status || "Unknown"}
                        color={
                          order?.status === "Shipped" ? "success" :
                          order?.status === "Pending" ? "warning" :
                          order?.status === "Cancelled" ? "error" :
                          order?.status === "Returned" ? "default" :
                          "info"
                        }
                      />
                    </TableCell>
                    <TableCell>{order?.ratings || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination count={3} color="primary" />
        </Box>
      </Paper>
    </Box>
  );
}