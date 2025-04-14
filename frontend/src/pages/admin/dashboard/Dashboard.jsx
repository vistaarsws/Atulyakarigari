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
  Icon,
} from "@mui/material";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
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

import "./Dashboard.css";
import totalOrderBp from "../../../assets/images/totalOrderBp.svg";
import newCustomersBp from "../../../assets/images/graphPattern.svg";
import totalRevenueBp from "../../../assets/images/linePattern.svg";

import totalOrdersIcon from "../../../assets/images/totalOrders.svg";
import userIcon from "../../../assets/images/user.svg";
import couponsIcon from "../../../assets/images/coupons.svg";
import moneyBagIcon from "../../../assets/images/moneyBag.svg";

const Dashboard = () => {
  const salesData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
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
        backgroundColor: ["#FFCF56", "#3CF871", "#5D78FF"],
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
    {
      name: "Banarasi Silk Saari",
      price: 6527,
      sell: "7,203",
      status: "Stock",
    },
    {
      name: "Banarasi Silk Saari",
      price: 6527,
      sell: "7,203",
      status: "Stock",
    },
    {
      name: "Banarasi Silk Saari",
      price: 6527,
      sell: "7,203",
      status: "Stock",
    },
    {
      name: "Banarasi Silk Saari",
      price: 6527,
      sell: "7,203",
      status: "Stock",
    },
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9fb" }}>
      <Grid container spacing={3}>
        {[
          {
            title: "Total Orders",
            value: "16,358",
            subtitle: "8.5% New Sessions Today",
            backgroundPattern: totalOrderBp,
            icon: totalOrdersIcon,
          },
          {
            title: "New Customers",
            value: "532",
            subtitle: "0.6% Bounce Rate Weekly",
            backgroundPattern: newCustomersBp,
            icon: userIcon,
          },
          {
            title: "Top Coupons",
            value: "78%",
            subtitle: "1.5% Weekly Avg. Sessions",
            backgroundPattern: "",
            icon: couponsIcon,
          },
          {
            title: "Total Revenue",
            value: "28,71,943",
            subtitle: "10.5% higher from previous month",
            backgroundPattern: totalRevenueBp,
            icon: moneyBagIcon,
            dark: true,
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: item.dark ? "#121212" : "white",
                color: item.dark ? "white" : "black",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
              }}
            >
              <Box>
                <CardContent>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="h4">{item.value}</Typography>
                  <Typography variant="body2">{item.subtitle}</Typography>
                </CardContent>
                <figure
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "16px",
                    height: "21px",
                    width: "21px",
                  }}
                >
                  <img
                    src={item.icon}
                    height="100%"
                    width="100%"
                    alt="Cart Image"
                  />
                </figure>
              </Box>

              {item.backgroundPattern && (
                <img
                  src={item.backgroundPattern}
                  style={{ objectFit: "cover", height: "80px" }}
                  className="background Pattern"
                />
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontSize: "16px", fontWeight: "500" }}
              >
                Devices Mode
              </Typography>
              <Typography
                variant="p"
                sx={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "#9F9F9F",
                }}
              >
                Device mode users prefer to view our website or make purchases.
              </Typography>
              <Box sx={{ marginTop: "1.5rem" }}>
                <Doughnut data={deviceData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
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
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                Earnings Reports
              </Typography>
              <TableContainer className="tableContainer">
                <Table>
                  <TableHead className="earningReportHeader">
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
                        <TableCell
                          style={{
                            color: row.tax === "--" ? "gray" : "#AD3F38",
                          }}
                        >
                          {row.tax}
                        </TableCell>
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
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                Most Popular Products
              </Typography>
              <TableContainer className="tableContainer">
                <Table>
                  <TableHead className="earningReportHeader">
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
                          <Chip
                            sx={{
                              borderRadius: "4px",
                              maxWidth: "60px",
                              width: "100%",
                              fontSize: "12px",
                              backgroundColor:
                                product.status === "Sold"
                                  ? "#AD3F381A"
                                  : "#76CBA763",
                              color:
                                product.status === "Sold"
                                  ? "#AD3F38"
                                  : "#60A487",
                            }}
                            label={product.status}
                            color={
                              product.status === "Sold" ? "error" : "success"
                            }
                          />
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
