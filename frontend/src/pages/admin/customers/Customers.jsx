import { useState } from "react";
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
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomerDetails from "./CustomerDetails";

// State and city data for India
const stateCityData = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
  "West Bengal": ["Kolkata", "Durgapur", "Siliguri"],
};

// Sample Customers Data
const customers = [
  {
    id: "ORD12345",
    name: "Aditi Kumari Singh",
    phone: "+91 8175961513",
    email: "aditisingh@gmail.com",
    state: "Madhya Pradesh",
    city: "Bhopal",
    stock: "Active",
    lastOrder: "02 Oct 2024",
    invoice: "12,000",
    buys: "06",
    category: "Handloom",
    payment: "₹72,000", // New field
    orders: [ // New field
      { id: "O-23456", payment: "₹10,000", status: "Shipped", ratings: 4.5 },
      { id: "O-23457", payment: "₹2,000", status: "Pending", ratings: 4.0 },
    ],
  },
  {
    id: "ORD12346",
    name: "Rohan Mehra",
    phone: "+91 9876543210",
    email: "rohanmehra@gmail.com",
    state: "Maharashtra",
    city: "Mumbai",
    stock: "Inactive",
    lastOrder: "05 Nov 2024",
    invoice: "15,000",
    buys: "10",
    category: "Jewellery",
    payment: "₹95,000",
    orders: [
      { id: "O-76543", payment: "₹15,000", status: "Cancelled", ratings: 3.5 },
      { id: "O-76544", payment: "₹8,000", status: "Returned", ratings: 4.2 },
    ],
  },
];


export default function Customers() {
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter function: Matches any field with search input
  const filteredCustomers = customers.filter((customer) => {
   
    const searchText = search.toLowerCase();
    return (
      (!category || customer.category === category) &&
      (!state || customer.state === state) &&
      (!city || customer.city === city) &&
      (!search ||
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.phone.includes(searchText) ||
        customer.state.toLowerCase().includes(searchText) ||
        customer.city.toLowerCase().includes(searchText) ||
        customer.invoice.includes(searchText) ||
        customer.lastOrder.includes(searchText))
    );
  });

  return selectedCustomer ? (
    <CustomerDetails
      customer={selectedCustomer}
      onBack={() => setSelectedCustomer(null)}
    />
  ) : (
    <Box sx={{ p: 3, bgcolor: "#FAF9FF", minHeight: "100vh" }}>
      <Typography variant="h6" fontWeight="bold">
        Customers
      </Typography>

      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        sx={{ mt: 2 }}
      >
        <Tab label="All (4621)" />
        <Tab label="New (421)" />
      </Tabs>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Category Dropdown */}
        <Grid item>
          <FormControl sx={{ width: 200, bgcolor: "white" }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="Handloom">Handloom</MenuItem>
              <MenuItem value="Handicraft">Handicraft</MenuItem>
              <MenuItem value="Jewellery">Jewellery</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* State Dropdown */}
        <Grid item>
          <FormControl sx={{ width: 200, bgcolor: "white" }}>
            <InputLabel>State</InputLabel>
            <Select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity(""); // Reset city when state changes
              }}
            >
              <MenuItem value="">Select State</MenuItem>
              {Object.keys(stateCityData).map((stateName) => (
                <MenuItem key={stateName} value={stateName}>
                  {stateName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* City Dropdown */}
        <Grid item>
          <FormControl sx={{ width: 200, bgcolor: "white" }} disabled={!state}>
            <InputLabel>City</InputLabel>
            <Select value={city} onChange={(e) => setCity(e.target.value)}>
              <MenuItem value="">Select City</MenuItem>
              {state &&
                stateCityData[state].map((cityName) => (
                  <MenuItem key={cityName} value={cityName}>
                    {cityName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Search Input */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by any field..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F7F5FF" }}>
            <TableRow>
              <TableCell>CUSTOMER</TableCell>
              <TableCell>PHONE</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>STATE</TableCell>
              <TableCell>CITY</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>LAST ORDER</TableCell>
              <TableCell>INVOICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                sx={{ cursor: "pointer" }}
                onClick={() => setSelectedCustomer(customer)} // Moved onClick here
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src="https://i.pravatar.cc/40" />
                    {customer.name}
                  </Box>
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.state}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{customer.category}</TableCell>
                <TableCell>{customer.lastOrder}</TableCell>
                <TableCell>{customer.invoice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination count={3} color="primary" />
      </Box>
    </Box>
  );
}
