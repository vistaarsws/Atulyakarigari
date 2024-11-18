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

const EditAddressModal = ({ open, handleClose, addressData, title }) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const [formData, setFormData] = useState({
    fullName: addressData?.name || "",
    mobileNumber: addressData?.mobile || "",
    pincode: addressData?.city?.split(" - ")[1] || "",
    address: addressData?.address || "",
    locality: addressData?.locality || "",
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
  const textFieldSx = {
    "& .MuiInputLabel-root": {
      fontSize: "1.2rem",
      color: "#6b7280",
      fontWeight: 500,
      backgroundColor: "white",
      padding: "0 4px",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#46846a",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(14px, -9px) scale(0.75)",
      zIndex: 1,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e0e0e0",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: "#46846a",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#46846a",
        borderWidth: "2px",
      },
      "& legend": {
        width: "0px",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "1.2rem",
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
            padding: "1rem",
            borderBottom: "1px solid #e0e0e0",
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1,
            borderRadius: "0.75rem",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "600", color: "#383737" }}>
            {title ? title : "Edit"} Address
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

        <Box
          sx={{
            padding: "2rem",
            maxHeight: "50vh",
            overflowY: "scroll",
            scrollbarWidth: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0rem 1rem",
          }}
        >
          <TextField
            name="fullName"
            label="Full Name"
            variant="outlined"
            fullWidth
            sx={{ ...textFieldSx, marginBottom: "2rem" }}
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            variant="outlined"
            fullWidth
            sx={{ ...textFieldSx, marginBottom: "2rem" }}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            name="pincode"
            label="Pincode"
            variant="outlined"
            fullWidth
            sx={{ ...textFieldSx, marginBottom: "2rem" }}
            value={formData.pincode}
            onChange={handleChange}
          />
          <TextField
            name="address"
            label="Address"
            variant="outlined"
            fullWidth
            sx={{ ...textFieldSx, marginBottom: "2rem" }}
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            name="locality"
            label="Locality / Town"
            variant="outlined"
            fullWidth
            sx={{ ...textFieldSx, marginBottom: "2rem" }}
            value={formData.locality}
            onChange={handleChange}
          />
          <TextField
            name="city"
            label="City / Distric"
            variant="outlined"
            fullWidth
            sx={{ ...textFieldSx, marginBottom: "2rem" }}
            value={formData.city}
            onChange={handleChange}
          />

          <Box>
            <Typography>Type of Address</Typography>
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
              alignItems: "end",
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
            padding: "0.5rem 1rem 2rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
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

              flexBasis: useMediaQuery("(max-width:425px)") ? "50%" : "",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              width: useMediaQuery("(max-width:425px)") ? "100%" : "102px",
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
              flexBasis: useMediaQuery("(max-width:425px)") ? "50%" : "",
            }}
            onClick={handleClose}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAddressModal;
