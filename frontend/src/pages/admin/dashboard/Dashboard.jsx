import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const Dashboard = () => {
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [500, 700, 400, 800, 600, 900, 750, 950, 700, 650, 500, 800],
        borderColor: "#ff9900",
        backgroundColor: "rgba(255, 153, 0, 0.5)",
        tension: 0.4,
      },
      {
        label: "Revenue",
        data: [400, 500, 600, 700, 800, 900, 1000, 750, 650, 800, 900, 700],
        borderColor: "#6c63ff",
        backgroundColor: "rgba(108, 99, 255, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const deviceData = {
    labels: ["Desktop", "Tablet", "Mobile"],
    datasets: [
      {
        data: [55, 15, 30],
        backgroundColor: ["#ff9900", "#6c63ff", "#34c759"],
      },
    ],
  };

  const earningsData = [
    { date: "01 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
    { date: "02 January", itemCount: 6527, tax: "--", earnings: "75,000" },
    { date: "03 January", itemCount: 6527, tax: "--", earnings: "75,000" },
    { date: "04 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
    { date: "05 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
    { date: "06 January", itemCount: 6527, tax: "--", earnings: "75,000" },
    { date: "07 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
  ];

  const productData = [
    { name: "Banarasi Silk Saari", price: 6527, sell: "7,203", status: "Sold" },
    { name: "Banarasi Silk Saari", price: 6527, sell: "7,203", status: "Stock" },
    { name: "Banarasi Silk Saari", price: 6527, sell: "7,203", status: "Stock" },
    { name: "Banarasi Silk Saari", price: 6527, sell: "7,203", status: "Stock" },
    { name: "Banarasi Silk Saari", price: 6527, sell: "7,203", status: "Stock" },
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9fb" }}>
      <Grid container spacing={3}>
        {[
          { title: "Total Orders", value: "16,358", subtitle: "8.5% New Sessions Today" },
          { title: "New Customers", value: "532", subtitle: "0.6% Bounce Rate Weekly" },
          { title: "Top Coupons", value: "78%", subtitle: "1.5% Weekly Avg. Sessions" },
          { title: "Total Revenue", value: "28,71,943", subtitle: "10.5% higher from previous month", dark: true },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: item.dark ? "#121212" : "white",
                color: item.dark ? "white" : "black",
                boxShadow: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h4">{item.value}</Typography>
                <Typography variant="body2">{item.subtitle}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6">Devices Mode</Typography>
              <Pie data={deviceData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6">Sales Report</Typography>
              <Select defaultValue="Monthly" sx={{ mb: 2 }}>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
              <Line data={salesData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6">Earnings Reports</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Item Count</TableCell>
                      <TableCell>Tax</TableCell>
                      <TableCell>Earnings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earningsData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.itemCount}</TableCell>
                        <TableCell style={{ color: row.tax === "--" ? "gray" : "red" }}>{row.tax}</TableCell>
                        <TableCell>{row.earnings}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6">Most Popular Products</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Sell</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productData.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.sell}</TableCell>
                        <TableCell>
                          <Chip label={product.status} color={product.status === "Sold" ? "error" : "success"} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
