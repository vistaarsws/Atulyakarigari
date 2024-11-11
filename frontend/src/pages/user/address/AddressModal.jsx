import { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  Checkbox,
  Button,
  FormControlLabel,
  TextField,
  Modal,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const EditAddressModal = ({ open, handleClose, addressData }) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [formData, setFormData] = useState({
    fullName: addressData?.name || "",
    mobileNumber: addressData?.mobile || "",
    pincode: addressData?.city?.split(" - ")[1] || "",
    address: addressData?.address || "",
    locality: "",
    city: addressData?.city?.split(" - ")[0] || "",
    addressType: addressData?.type?.toLowerCase() || "home",
    isDefault: addressData?.isDefault || false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      isDefault: event.target.checked,
    }));
  };

  const handleRadioChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      addressType: event.target.value,
    }));
  };

  const labelStyle = {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: "0.25rem",
  };

  const inputStyle = {
    "& .MuiInputBase-input": {
      color: "#383737",
      padding: "0",
      fontSize: "1.4rem",
      "&:focus": {
        backgroundColor: "transparent",
      },
    },
    "& .MuiInput-underline:before": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: "none",
    },
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-address-modal"
      aria-describedby="modal-to-edit-address"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "0",
          borderRadius: "0.75rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: isMobile ? "90%" : "100%",
          maxWidth: isMobile ? "90%" : "52rem",
        }}
      >
        {/* Fixed header with close icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem",
            borderBottom: "1px solid #e0e0e0",
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1,
            borderRadius: "0.75rem",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "600", color: "#383737" }}>
            Edit Address
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#6b7280",
              "&:hover": {
                color: "#383737",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable content area */}
        <Box
          sx={{
            padding: "2rem",
            maxHeight: "60vh",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {/* Form fields */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "1rem" : 0,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: isMobile ? "100%" : "50%",
                paddingRight: isMobile ? 0 : "0.5rem",
              }}
            >
              <Typography sx={labelStyle}>Full Name</Typography>
              <TextField
                fullWidth
                variant="standard"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Box>
            <Box
              sx={{
                width: isMobile ? "100%" : "50%",
                paddingLeft: isMobile ? 0 : "0.5rem",
              }}
            >
              <Typography sx={labelStyle}>Mobile Number</Typography>
              <TextField
                fullWidth
                variant="standard"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "1rem" : 0,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: isMobile ? "100%" : "50%",
                paddingRight: isMobile ? 0 : "0.5rem",
              }}
            >
              <Typography sx={labelStyle}>Pincode</Typography>
              <TextField
                fullWidth
                variant="standard"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Box>
            <Box
              sx={{
                width: isMobile ? "100%" : "50%",
                paddingLeft: isMobile ? 0 : "0.5rem",
              }}
            >
              <Typography sx={labelStyle}>Address</Typography>
              <TextField
                fullWidth
                variant="standard"
                name="address"
                value={formData.address}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "1rem" : 0,
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: isMobile ? "100%" : "50%",
                paddingRight: isMobile ? 0 : "0.5rem",
              }}
            >
              <Typography sx={labelStyle}>Locality/Town</Typography>
              <TextField
                fullWidth
                variant="standard"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Box>
            <Box
              sx={{
                width: isMobile ? "100%" : "50%",
                paddingLeft: isMobile ? 0 : "0.5rem",
              }}
            >
              <Typography sx={labelStyle}>City/District</Typography>
              <TextField
                fullWidth
                variant="standard"
                name="city"
                value={formData.city}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={labelStyle}>Type of Address</Typography>
              <Box
                sx={{
                  marginTop: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Radio
                      size="large"
                      checked={formData.addressType === "home"}
                      onChange={handleRadioChange}
                      value="home"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "1.4rem", color: "#383737" }}>
                      Home
                    </Typography>
                  }
                  sx={{ marginRight: "1rem" }}
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.addressType === "office"}
                      onChange={handleRadioChange}
                      value="office"
                      size="large"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "1.4rem", color: "#383737" }}>
                      Office
                    </Typography>
                  }
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mx: isMobile ? 0 : 4,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isDefault}
                    onChange={handleCheckboxChange}
                    size="large"
                  />
                }
                label={
                  <Typography sx={{ fontSize: "1.2rem", color: "#6b7280" }}>
                    Make this my default Address
                  </Typography>
                }
              />
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Button
              variant="outlined"
              color="success"
              sx={{
                borderRadius: "0.375rem",
                color: "#73af96",
                borderColor: "#73af96",
                "&:hover": {
                  color: "#ffffff",
                  borderColor: "#60a487",
                  backgroundColor: "#60a487",
                },
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                color: "white",
                borderRadius: "0.375rem",
                backgroundColor: "rgba(173, 63, 56, 1)",
                "&:hover": {
                  backgroundColor: "#6d001d",
                },
              }}
              onClick={handleClose}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAddressModal;
