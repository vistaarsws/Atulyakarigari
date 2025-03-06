import React, { useEffect, useState } from "react";
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
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddressModal from "./AddressModal";
import { useLocation } from "react-router-dom";
import {
  deleteAddress,
  getAddress,
  updateAddress,
} from "../../../../services/user/userAPI";
import { setSelectedAddressID } from "../../../../Redux/features/AddressSlice";
import { useDispatch, useSelector } from "react-redux";


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
  address,
  city,
  fullName,
  isDefault,
  date,
  locality,
  mobileNumber,
  pincode,
  typeOfAddress,
  getAllAddress,
  addressId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPlaceOrder = useLocation()?.pathname === "/place-order";

  const dispatch = useDispatch();
  const selectedAddressID = useSelector((state) => state.address.selectedAddressID); 

  const deleteAddressHandler = async () => {
    try {
      await deleteAddress(addressId);
      getAllAddress();
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleSelectAddress = () => {
    dispatch(setSelectedAddressID(addressId));
  };

  return (
    <>
      <Box position="relative" mb={2}>
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
            <Box display="flex" alignItems="center">
              {/* **Radio Button for Selecting Address** */}
              {isPlaceOrder && (
                <FormControlLabel
                  sx={{ mr: 1 }}
                  value={addressId}
                  control={<Radio />}
                  checked={selectedAddressID === addressId}
                  onChange={handleSelectAddress}
                />
              )}

              {/* **Address Date** */}
              <Typography fontSize="12px" fontWeight={400} color="rgba(56, 55, 55, 1)">
                Added on {date}
              </Typography>
            </Box>

            {/* **Address Type Label** */}
            <Button
              variant="outlined"
              sx={{
                height: "35px",
                padding: "9px 20px",
                color: "#9f9f9f",
                borderColor: "#e2e2e2",
                fontSize: { xs: "12px", md: "16px" },
                fontWeight: 400,
                textTransform: "capitalize",
              }}
            >
              {typeOfAddress}
            </Button>
          </Box>

          {/* **Address Details** */}
          <Box color="#374151">
            <Typography fontWeight={600} fontSize="14px" mb="1rem" color="rgba(56, 55, 55, 1)">
              {fullName}
            </Typography>
            {[address, city, locality].map((line, index) => (
              <Typography key={index} color="rgba(111, 111, 111, 1)" fontSize="14px" fontWeight={400}>
                {line}
              </Typography>
            ))}
            <Typography mt="1rem" color="rgba(111, 111, 111, 1)" fontSize="14px" fontWeight={400}>
              Mobile: {mobileNumber}
            </Typography>
          </Box>

          {/* **Action Buttons** */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt="1rem">
            <Button
              variant="outlined"
              color="success"
              sx={buttonStyles("outlined", "#73af96", "#60a487")}
              onClick={() => setIsModalOpen(true)}
            >
              Edit
            </Button>

            <Button
              variant="contained"
              color="error"
              sx={buttonStyles("contained", "rgba(173, 63, 56, 1)", "#6d001d")}
              onClick={deleteAddressHandler}
            >
              {isPlaceOrder ? "Remove" : "Delete"}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* **Edit Address Modal** */}
      <AddressModal
        title="Edit"
        getAllAddress={getAllAddress}
        open={isModalOpen}
        addressId={addressId}
        handleClose={() => setIsModalOpen(false)}
        addressData={{
          address,
          city,
          fullName,
          isDefault,
          date,
          locality,
          mobileNumber,
          pincode,
          typeOfAddress,
        }}
      />
    </>
  );
};

// **Reusable Button Styles**
const buttonStyles = (variant, mainColor, hoverColor) => ({
  width: "102px",
  height: "35px",
  padding: "9px 20px",
  fontSize: "16px",
  fontWeight: 400,
  textTransform: "capitalize",
  ...(variant === "outlined"
    ? {
        color: mainColor,
        borderColor: mainColor,
        "&:hover": { color: "#fff", borderColor: hoverColor, backgroundColor: hoverColor },
      }
    : {
        color: "#fff",
        backgroundColor: mainColor,
        "&:hover": { borderColor: hoverColor, backgroundColor: hoverColor },
      }),
});


const AddressUI = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const isPlaceOrder = useLocation()?.pathname === "/place-order";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddressSelection = (addressId) => {
    const addr = addressId === selectedAddress ? null : addressId;
    setSelectedAddress(addr);
    localStorage.setItem("selectedAddressID", JSON.stringify(addr));
    console.log(addr);
  };

  const getAllAddress = async () => {
    try {
      const response = await getAddress();

      if (response?.data?.success) {
        // Check if addresses exist; if not, set an empty array
        setAddresses(response?.data?.data || []);
      } else {
        console.warn(response?.data?.message || "No addresses found.");
        setAddresses([]); // Set to empty array to prevent errors
      }
    } catch (error) {
      console.error("Error fetching addresses:", error.message);
      setAddresses([]); // Ensure state is cleared if there's an error
    }
  };

  useEffect(() => {
    getAllAddress();
  }, []);

  useEffect(() => {
    const storedAddress = JSON.parse(localStorage.getItem("selectedAddressID"));
    getAllAddress();

    if (storedAddress) {
      setSelectedAddress(storedAddress);
    }
  }, []);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((addr) => addr.isDefault);
      const firstAddr = addresses[0];

      const addrToSelect = defaultAddr ? defaultAddr._id : firstAddr._id;
      setSelectedAddress(addrToSelect);
      localStorage.setItem("selectedAddressID", JSON.stringify(addrToSelect));
    }
  }, [addresses]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          maxWidth={isPlaceOrder ? "auto" : "md"}
          sx={{
            mt: "2%",
            marginInline: "5%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",

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
                    color: "#ffffff",

                    "&:hover": {
                      color: "#ffffff",
                    },
                  }}
                />
              }
              sx={{
                height: "35px",
                padding: "9px 20px",
                borderColor: "#60a487",
                backgroundColor: "#60a487",
                color: "#ffffff",
                fontSize: {
                  xs: "12px",
                  md: "16px",
                },
                fontWeight: 400,
                textAlign: "left",
                textTransform: "capitalize",
                "&:hover": {
                  color: "#ffffff",
                  borderColor: "#46846A",
                  backgroundColor: "#46846A",
                  "& .MuiSvgIcon-root": {
                    color: "#ffffff",
                  },
                },
              }}
              onClick={handleOpenModal}
            >
              Add New Address
            </Button>
          </Box>
          <Box
            sx={{
              height: "auto",
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <RadioGroup
              value={selectedAddress || ""}
              onChange={(e) => handleAddressSelection(e.target.value)}
            >
              <Typography
                color="rgba(96, 164, 135, 1)"
                fontWeight={700}
                fontSize="14px"
                lineHeight="21px"
                mb="1rem"
              >
                Default Address
              </Typography>

              {Object.values(addresses).map((addr) => {
                if (addr.isDefault) {
                  return (
                    <AddressCard
                      key={addr?._id}
                      {...addr}
                      getAllAddress={getAllAddress}
                      isSelected={selectedAddress === addr?._id}
                      onSelect={handleAddressSelection}
                      addressId={addr?._id}
                    />
                  );
                }
              })}

              <Typography
                color="rgba(96, 164, 135, 1)"
                fontWeight={700}
                fontSize="14px"
                lineHeight="21px"
                mb={"1rem"}
              >
                Other Address
              </Typography>
              {Object.values(addresses).map((addr) => {
                if (!addr.isDefault) {
                  return (
                    <AddressCard
                      key={addr?._id}
                      {...addr}
                      getAllAddress={getAllAddress}
                      isSelected={selectedAddress === addr?._id}
                      onSelect={handleAddressSelection}
                      addressId={addr?._id}
                    />
                  );
                }
              })}
            </RadioGroup>
          </Box>
        </Box>
      </ThemeProvider>
      <AddressModal
        getAllAddress={getAllAddress}
        title={"Add"}
        open={isModalOpen}
        handleClose={handleCloseModal}
        addressData={null}
      />
    </>
  );
};

export default AddressUI;
