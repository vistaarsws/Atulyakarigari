import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Sample data for the metrics and charts
  const totalOrdersData = Array(20)
    .fill()
    .map(() => Math.floor(Math.random() * 40) + 35);
  const newCustomersData = [
    10, 15, 12, 20, 18, 25, 30, 35, 25, 38, 40, 50, 60, 55, 40, 30, 25, 20,
  ];
  const revenueData = [
    30, 40, 35, 50, 45, 60, 55, 65, 60, 70, 65, 75, 70, 80, 75, 90, 85, 95,
  ];

  const months = [
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
  ];

  const salesLineData = {
    labels: months,
    datasets: [
      {
        label: "Product A",
        data: [500, 425, 775, 450, 775, 325, 200, 350, 850, 950, 650, 250],
        borderColor: "#8A70D6",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: "Product B",
        data: [750, 700, 150, 350, 500, 850, 500, 525, 200, 450, 550, 800],
        borderColor: "#FFB74D",
        backgroundColor: "transparent",
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Data for earnings report table
  const earningsData = [
    { date: "01 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
    { date: "02 January", itemCount: 6527, tax: "--", earnings: "75,000" },
    { date: "03 January", itemCount: 6527, tax: "--", earnings: "75,000" },
    { date: "04 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
    { date: "05 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
    { date: "06 January", itemCount: 6527, tax: "--", earnings: "75,000" },
    { date: "07 January", itemCount: 6527, tax: "7,203", earnings: "75,000" },
  ];

  // Data for popular products
  const popularProducts = [
    {
      name: "Banarsi Silk Saari",
      price: "6527",
      sell: "7,203",
      status: "Sold",
    },
    {
      name: "Banarsi Silk Saari",
      price: "6527",
      sell: "7,203",
      status: "Stock",
    },
    {
      name: "Banarsi Silk Saari",
      price: "6527",
      sell: "7,203",
      status: "Stock",
    },
    {
      name: "Banarsi Silk Saari",
      price: "6527",
      sell: "7,203",
      status: "Sold",
    },
    {
      name: "Banarsi Silk Saari",
      price: "6527",
      sell: "7,203",
      status: "Sold",
    },
    {
      name: "Banarsi Silk Saari",
      price: "6527",
      sell: "7,203",
      status: "Stock",
    },
    {
      name: "Banarsi Silk Saari",
      price: "6527",
      sell: "7,203",
      status: "Stock",
    },
  ];

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#FBFBFB",
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        sx={{ py: 2, fontWeight: 400, color: "#333", fontSize: "20px" }}
      >
        Dashboard
      </Typography>

      {/* Metrics Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Total Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              height: "95%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#555", fontSize: 14, fontWeight: 400 }}>
                Total Orders
              </Typography>
              <ShoppingCartOutlinedIcon sx={{ color: "#ddd", fontSize: 20 }} />
            </Box>
            <Typography
              sx={{ fontSize: 24, fontWeight: 500, color: "#212121" }}
            >
              16358
            </Typography>
            <Typography sx={{ color: "#666", fontSize: 11, mb: 2 }}>
              8.5% New Sessions Today
            </Typography>

            <Box sx={{ height: 60 }}>
              <Bar
                data={{
                  labels: Array(20).fill(""),
                  datasets: [
                    {
                      data: totalOrdersData,
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 60);
                        gradient.addColorStop(0, "#7C4DFF"); // Top color
                        return gradient;
                      },
                      barThickness: 3,
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                  },
                  scales: {
                    x: {
                      display: false,
                      grid: { display: false },
                    },
                    y: {
                      display: false,
                      grid: { display: false },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* New Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              height: "95%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#555", fontSize: 14, fontWeight: 400 }}>
                New customers
              </Typography>
              <PersonOutlineOutlinedIcon sx={{ color: "#ddd", fontSize: 20 }} />
            </Box>
            <Typography
              sx={{ fontSize: 24, fontWeight: 500, color: "#212121" }}
            >
              532
            </Typography>
            <Typography sx={{ color: "#F44336", fontSize: 11, mb: 2 }}>
              0.6% Bounce Rate Weekly
            </Typography>

            <Box sx={{ height: 60, position: "relative" }}>
              <Line
                data={{
                  labels: Array(18).fill(""),
                  datasets: [
                    {
                      data: newCustomersData,
                      borderColor: "#4caf50",
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      fill: true,
                      borderWidth: 2,
                      pointRadius: 0,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 5,
                  bgcolor: "rgba(245, 245, 245, 0.8)",
                  borderRadius: 1,
                  px: 0.8,
                  py: 0.3,
                  fontSize: 10,
                  lineHeight: 1.2,
                  color: "#666",
                }}
              >
                7PM - 8PM
                <br />
                29 Customers
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Top Coupons */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              height: "95%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#555", fontSize: 14, fontWeight: 400 }}>
                Top Coupons
              </Typography>
              <LocalOfferOutlinedIcon sx={{ color: "#ddd", fontSize: 20 }} />
            </Box>
            <Typography
              sx={{ fontSize: 24, fontWeight: 500, color: "#212121" }}
            >
              78%
            </Typography>
            <Typography sx={{ color: "#666", fontSize: 11 }}>
              1.5% Weekly Avg. Sessions
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: 65, height: 65 }}>
                <Doughnut
                  data={{
                    labels: ["Sent", "Opened", "Not Opened"],
                    datasets: [
                      {
                        data: [50, 45, 5],
                        backgroundColor: ["#FFC857", "#5C7AFF", "#3DF870"],

                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false },
                    },
                    cutout: "65%",
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: "flex", alignItems: "end" }}>
                  <Box
                    component="span"
                    sx={{
                      color: "#FFC857",
                      fontSize: 20,
                      fontWeight: "semibold",
                      mr: "0.3rem",
                    }}
                  >
                    ›
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "#666" }}>
                    Sent
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "end" }}>
                  <Box
                    component="span"
                    sx={{
                      color: "#5C7AFF",
                      fontSize: 20,
                      fontWeight: "semibold",
                      mr: "0.3rem",
                    }}
                  >
                    ›
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "#666" }}>
                    Opened
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "end" }}>
                  <Box
                    component="span"
                    sx={{
                      color: "#3DF870",
                      fontSize: 20,
                      fontWeight: "semibold",
                      mr: "0.3rem",
                    }}
                  >
                    ›
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "#666" }}>
                    Not Opened
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#000000",
              color: "white",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              height: "95%",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ color: "#eee", fontSize: 14, fontWeight: 400 }}>
                Total Revenue
              </Typography>
              <AccountBalanceWalletOutlinedIcon
                sx={{ color: "#aaa", fontSize: 20 }}
              />
            </Box>
            <Typography sx={{ fontSize: 24, fontWeight: 500 }}>
              28,71,943
            </Typography>
            <Typography sx={{ color: "#8BC34A", fontSize: 11, mb: 2 }}>
              10.5% higher from previous month
            </Typography>

            <Box sx={{ height: 60 }}>
              <Line
                data={{
                  labels: Array(18).fill(""),
                  datasets: [
                    {
                      data: revenueData,
                      borderColor: "#4BC0C0",
                      borderWidth: 2,
                      pointRadius: 0,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Second Row - Devices & Sales Report */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Devices Mode */}
        <Grid item xs={12} md={4}>
          <Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
                height: "100%",
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#333" }}>
                Devices Mode
              </Typography>
              <Typography
                sx={{ color: "#999", fontSize: 15, mb: 2, lineHeight: 1.3 }}
              >
                Device mode users prefer to view our website or make purchases.
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: 180, height: 180 }}>
                    <Doughnut
                      data={{
                        labels: ["Desktop", "Tablet", "Mobile"],
                        datasets: [
                          {
                            data: [60, 10, 30],
                            backgroundColor: ["#FFC857", "#3DF870", "#5C7AFF"],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        plugins: { legend: { display: false } },
                        cutout: "65%",
                        responsive: true,
                        maintainAspectRatio: true,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ ml: 5 }}>
                  <Box sx={{ display: "flex", alignItems: "end", mb: 0.7 }}>
                    <Box
                      component="span"
                      sx={{
                        color: "#FFC857",
                        fontSize: 20,
                        fontWeight: "semibold",
                        mr: "0.5rem",
                      }}
                    >
                      ›
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#666" }}>
                      Desktop
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "end", mb: 0.7 }}>
                    <Box
                      component="span"
                      sx={{
                        color: "#3DF870",
                        fontSize: 20,
                        fontWeight: "semibold",
                        mr: "0.5rem",
                      }}
                    >
                      ›
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#666" }}>
                      Tablet
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "end" }}>
                    <Box
                      component="span"
                      sx={{
                        color: "#5C7AFF",
                        fontSize: 20,
                        fontWeight: "semibold",
                        mr: "0.5rem",
                      }}
                    >
                      ›
                    </Box>
                    <Typography sx={{ fontSize: 12, color: "#666" }}>
                      Mobile
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    py: 0.5,
                    px: 2,
                    borderRadius: 2,
                    border: "1px solid #E0E0E0",
                    bgcolor: "#f5f5f5",
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#A5A5A4",
                  }}
                >
                  01 January 2023 to 31 December 2024
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Sales Report */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#333" }}>
                Sales Report
              </Typography>
              <Box
                sx={{
                  bgcolor: "#E6E3F6",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: 12,
                  fontWeight: "semibold",
                  color: "#7152CB",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Monthly
                <KeyboardArrowDownIcon
                  sx={{ ml: 0.5, fontSize: 18, color: "#3E3CC3" }}
                />
              </Box>
            </Box>

            <Box sx={{ height: 260 }}>
              <Line
                data={salesLineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      grid: {
                        color: "#f0f0f0",
                      },
                      ticks: {
                        color: "#999",
                        font: {
                          size: 10,
                        },
                      },
                      border: {
                        display: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                      max: 1000,
                      ticks: {
                        stepSize: 250,
                        color: "#999",
                        font: {
                          size: 10,
                        },
                      },
                      grid: {
                        color: "#f0f0f0",
                      },
                      border: {
                        display: false,
                      },
                    },
                  },
                  elements: {
                    point: {
                      radius: 0,
                      hoverRadius: 5,
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Third Row - Earnings & Popular Products */}
      <Grid container spacing={2}>
        {/* Earnings Reports */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#333" }}>
                Earnings Reports
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: 11, color: "#999", mr: 1 }}>
                  Earnings Reports Last Week
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#EDF2FF",
                    color: "#5C7AFF",
                    px: 1,
                    py: 0.3,
                    borderRadius: 1,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  $ 14729
                </Box>
              </Box>
            </Box>

            <TableContainer sx={{ borderRadius: 1, overflow: "hidden" }}>
              <Table
                size="small"
                sx={{ borderCollapse: "separate", borderSpacing: 0 }}
              >
                <TableHead sx={{ bgcolor: "#EEECF8" }}>
                  <TableRow>
                    <TableCell
                      sx={{ fontSize: 11, py: 1.5, borderBottom: "none" }}
                    >
                      DATE
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 11, py: 1.5, borderBottom: "none" }}
                    >
                      ITEM COUNT
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 11, py: 1.5, borderBottom: "none" }}
                    >
                      TAX
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 11, py: 1.5, borderBottom: "none" }}
                    >
                      EARNINGS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {earningsData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          color: "#666",
                          fontSize: 11,
                          py: 1.5,
                          borderBottom: "1px dashed #C0C0C0",
                        }}
                      >
                        {row.date}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#666",
                          fontSize: 11,
                          py: 1.5,
                          borderBottom: "1px dashed #C0C0C0",
                        }}
                      >
                        {row.itemCount}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: row.tax !== "--" ? "#F44336" : "#888",
                          fontSize: 11,
                          py: 1.5,
                          borderBottom: "1px dashed #C0C0C0",
                        }}
                      >
                        {row.tax}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#666",
                          fontSize: 11,
                          py: 1.5,
                          borderBottom: "1px dashed #C0C0C0",
                        }}
                      >
                        {row.earnings}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Most Popular Products */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#FFFFFF",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "start",
                mb: 2,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#333" }}>
                Most Popular Products
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontSize: 11, color: "#999", mr: 1 }}>
                  New Product Last Week
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#E8EAF6",
                    color: "#5C6BC0",
                    px: 1,
                    py: 0.3,
                    borderRadius: 1,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  3
                </Box>
              </Box>
            </Box>

            <TableContainer sx={{ borderRadius: 1, overflow: "hidden" }}>
              <Table
                size="small"
                sx={{ borderCollapse: "separate", borderSpacing: 0 }}
              >
                <TableHead sx={{ bgcolor: "#EEECF8" }}>
                  <TableRow>
                    <TableCell sx={{ fontSize: 11, py: 1.5 }}>
                      PRODUCT NAME
                    </TableCell>
                    <TableCell sx={{ fontSize: 11, py: 1.5 }}>PRICE</TableCell>
                    <TableCell sx={{ fontSize: 11, py: 1.5 }}>SELL</TableCell>
                    <TableCell sx={{ fontSize: 11, py: 1.5 }}>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {popularProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          color: "#666",
                          fontSize: 11,
                          py: 1.5,
                          borderBottom: "1px dashed #C0C0C0",
                        }}
                      >
                        {product.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#666",
                          fontSize: 11,
                          py: 1.5,
                          borderBottom: "1px dashed #C0C0C0",
                        }}
                      >
                        {product.price}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#F44336",
                          fontSize: 11,
                          py: 1.5,
                          borderBottom: "1px dashed #C0C0C0",
                        }}
                      >
                        {product.sell}
                      </TableCell>
                      <TableCell
                        sx={{ py: 1.5, borderBottom: "1px dashed #C0C0C0" }}
                      >
                        <Box
                          sx={{
                            display: "inline-block",
                            py: 0.3,
                            px: 1.5,
                            borderRadius: 4,
                            fontSize: 10,
                            bgcolor:
                              product.status === "Sold" ? "#FFEBEE" : "#E8F5E9",
                            color:
                              product.status === "Sold" ? "#F44336" : "#4CAF50",
                          }}
                        >
                          {product.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
