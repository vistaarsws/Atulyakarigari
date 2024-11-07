import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  styled,
  ThemeProvider,
  createTheme,
  IconButton,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditAddressModal from "./AddressModal";
import { useLocation } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: "Lato",
  },
  palette: {
    primary: {
      main: "#10B981",
    },
    error: {
      main: "#DC2626",
    },
  },
});

const AddressCard = ({
  isDefault,
  date,
  type,
  name,
  address,
  city,
  state,
  mobile,
  isSelected,
  onSelect,
  addressId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const isPlaceOrder = useLocation()?.pathname === "/place-order";
  return (
    <>
      <Box position="relative" mb={8}>
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            p: 3,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                {" "}
                <FormControlLabel
                  sx={{ mr: 1, display: isPlaceOrder ? "" : "none" }}
                  value={addressId}
                  control={<Radio />}
                  checked={isSelected}
                  onChange={() => onSelect(addressId)}
                />
                <Typography
                  color="rgba(96, 164, 135, 1)"
                  fontWeight={700}
                  fontSize="14px"
                  lineHeight="21px"
                >
                  {isDefault ? "Default Address" : "Other Address"}
                </Typography>
              </Box>

              <Typography
                fontWeight={400}
                color="rgba(56, 55, 55, 1)"
                fontSize="12px"
                lineHeight="21px"
              >
                Added on {date}
              </Typography>
            </Box>
            {/* <Button
              variant="outlined"
              sx={{
                color: "#6B7280",
                borderColor: "#D1D5DB",
                textTransform: "capitalize",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              {type}
            </Button> */}
            <Button
              variant="outlined"
              sx={{
                height: "35px",
                padding: "9px 20px",
                color: "#9f9f9f",
                borderColor: "#e2e2e2",
                // fontSize: "16px",
                fontSize: {
                  xs: "12px",
                  md: "16px",
                },
                fontWeight: 400,
                textAlign: "left",
                textTransform: "capitalize",
              }}
            >
              {type}
            </Button>
          </Box>
          <Box color="#374151">
            <Typography
              fontWeight={600}
              fontSize="14px"
              color="rgba(56, 55, 55, 1)"
              mb="1rem"
            >
              {name}
            </Typography>
            <Typography
              color="rgba(111, 111, 111, 1)"
              fontSize="14px"
              fontWeight={400}
            >
              {address}
            </Typography>
            <Typography
              color="rgba(111, 111, 111, 1)"
              fontSize="14px"
              fontWeight={400}
            >
              {city}
            </Typography>
            <Typography
              color="rgba(111, 111, 111, 1)"
              fontSize="14px"
              fontWeight={400}
            >
              {state}
            </Typography>
            <Typography
              color="rgba(111, 111, 111, 1)"
              fontSize="14px"
              fontWeight={400}
              mt="3rem"
            >
              Mobile: {mobile}
            </Typography>
          </Box>
        </Paper>
        <Box
          position="absolute"
          bottom="-50px"
          right="16px"
          display="flex"
          gap={2}
        >
          {isPlaceOrder ? (
            <>
              <Button
                variant="outlined"
                color="success"
                sx={{
                  width: "102px",
                  height: "35px",
                  padding: "9px 20px",
                  color: "#73af96",
                  borderColor: "#73af96",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "left",
                  textTransform: "capitalize",
                  "&:hover": {
                    color: "#ffffff",
                    borderColor: "#60a487",
                    backgroundColor: "#60a487",
                  },
                }}
                onClick={handleOpenModal}
              >
                Remove
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{
                  width: "102px",
                  height: "35px",
                  padding: "9px 20px",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "left",
                  color: "#ffffff",
                  textTransform: "capitalize",
                  backgroundColor: "rgba(173, 63, 56, 1)",
                  border: "none",
                  "&:hover": {
                    color: "#ffffff",
                    borderColor: "#6d001d",
                    backgroundColor: "#6d001d",
                  },
                }}
              >
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="success"
                sx={{
                  width: "102px",
                  height: "35px",
                  padding: "9px 20px",
                  color: "#73af96",
                  borderColor: "#73af96",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "left",
                  textTransform: "capitalize",
                  "&:hover": {
                    color: "#ffffff",
                    borderColor: "#60a487",
                    backgroundColor: "#60a487",
                  },
                }}
                onClick={handleOpenModal}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{
                  width: "102px",
                  height: "35px",
                  padding: "9px 20px",
                  fontSize: "16px",
                  fontWeight: 400,
                  textAlign: "left",
                  color: "#ffffff",
                  textTransform: "capitalize",
                  backgroundColor: "rgba(173, 63, 56, 1)",
                  border: "none",
                  "&:hover": {
                    color: "#ffffff",
                    borderColor: "#6d001d",
                    backgroundColor: "#6d001d",
                  },
                }}
              >
                Save
              </Button>
            </>
          )}
        </Box>
      </Box>
      <EditAddressModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        addressData={{
          name,
          mobile,
          address,
          city,
          state,
          type,
          isDefault,
        }}
      />
    </>
  );
};

const AddressUI = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const isPlaceOrder = useLocation()?.pathname === "/place-order";

  const handleAddressSelection = (addressId) => {
    setSelectedAddress(addressId === selectedAddress ? null : addressId);
  };
  const addresses = [
    {
      id: "addr1",
      isDefault: true,
      date: "Wed, 3 Apr 2024",
      type: "Home",
      name: "MAYURI SRIVASTAVA",
      address: "House no. 140, puja shree nagar cto, bairagarh, Bhopal",
      city: "Bhopal - 462030",
      state: "Madhya Pradesh",
      mobile: "817596153315",
    },
    {
      id: "addr2",
      isDefault: false,
      date: "Wed, 3 Apr 2024",
      type: "Office",
      name: "MAYURI SRIVASTAVA",
      address: "House no. 140, puja shree nagar cto, bairagarh, Bhopal",
      city: "Bhopal - 462030",
      state: "Madhya Pradesh",
      mobile: "817596153315",
    },
    {
      id: "addr3",
      isDefault: false,
      date: "Wed, 3 Apr 2024",
      type: "Office",
      name: "MAYURI SRIVASTAVA",
      address: "House no. 140, puja shree nagar cto, bairagarh, Bhopal",
      city: "Bhopal - 462030",
      state: "Madhya Pradesh",
      mobile: "817596153315",
    },
    {
      id: "addr4",
      isDefault: false,
      date: "Wed, 3 Apr 2024",
      type: "Office",
      name: "MAYURI SRIVASTAVA",
      address: "House no. 140, puja shree nagar cto, bairagarh, Bhopal",
      city: "Bhopal - 462030",
      state: "Madhya Pradesh",
      mobile: "817596153315",
    },
    {
      id: "addr5",
      isDefault: false,
      date: "Wed, 3 Apr 2024",
      type: "Office",
      name: "MAYURI SRIVASTAVA",
      address: "House no. 140, puja shree nagar cto, bairagarh, Bhopal",
      city: "Bhopal - 462030",
      state: "Madhya Pradesh",
      mobile: "817596153315",
    },
  ];
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          maxWidth={isPlaceOrder ? "auto" : "md"}
          sx={{
            py: 4,
            ml: 2,
            mr: 6,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              ml: { md: "8rem" },
              alignItems: "center",
              mb: "12px",
            }}
          >
            <Box>
              <Typography
                color="#383737"
                fontWeight={900}
                lineHeight="21px"
                fontSize="16px"
              >
                Saved Address
              </Typography>
              <Typography color="#6f6f6f">from anywhere</Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={
                <AddIcon
                  sx={{
                    color: "#73af96",
                    "&:hover": {
                      color: "#ffffff",
                    },
                  }}
                />
              }
              sx={{
                height: "35px",
                padding: "9px 20px",
                color: "#9f9f9f",
                borderColor: "#e2e2e2",
                // fontSize: "16px",
                fontSize: {
                  xs: "12px",
                  md: "16px",
                },
                fontWeight: 400,
                textAlign: "left",
                textTransform: "capitalize",
                "&:hover": {
                  color: "#ffffff",
                  borderColor: "#60a487",
                  backgroundColor: "#60a487",
                  "& .MuiSvgIcon-root": {
                    color: "#ffffff",
                  },
                },
              }}
            >
              Add New Address
            </Button>
          </Box>
          <Box
            sx={{
              height: "74vh",
              overflowY: "scroll",
              scrollbarWidth: "none",
              ml: { md: "8rem" },
            }}
          >
            <RadioGroup
              value={selectedAddress || ""}
              onChange={(e) => handleAddressSelection(e.target.value)}
            >
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  {...addr}
                  isSelected={selectedAddress === addr.id}
                  onSelect={handleAddressSelection}
                  addressId={addr.id}
                />
              ))}
            </RadioGroup>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default AddressUI;
