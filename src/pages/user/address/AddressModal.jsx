import React from "react";
import {
  Box,
  Typography,
  Radio,
  Checkbox,
  Button,
  FormControlLabel,
} from "@mui/material";

const EditAddress = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f3f4f6", // equivalent to bg-gray-100
        minHeight: "100vh", // h-screen
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white", // equivalent to bg-white
          padding: "2rem", // equivalent to p-8
          borderRadius: "0.75rem", // equivalent to rounded-lg
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // equivalent to shadow-md
          width: "100%",
          maxWidth: "32rem", // equivalent to max-w-lg
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "600", marginBottom: "1.5rem" }}
        >
          Edit Address
        </Typography>

        <Box sx={{ gap: "1.5rem", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "50%", paddingRight: "0.5rem" }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#6b7280",
                }}
              >
                Full Name
              </Typography>
              <Typography sx={{ marginTop: "0.25rem", color: "#111827" }}>
                Savvy Srivastava
              </Typography>
            </Box>
            <Box sx={{ width: "50%", paddingLeft: "0.5rem" }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#6b7280",
                }}
              >
                Mobile Number
              </Typography>
              <Typography sx={{ marginTop: "0.25rem", color: "#111827" }}>
                8175961513
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "50%", paddingRight: "0.5rem" }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#6b7280",
                }}
              >
                Pincode
              </Typography>
              <Typography sx={{ marginTop: "0.25rem", color: "#111827" }}>
                462030
              </Typography>
            </Box>
            <Box sx={{ width: "50%", paddingLeft: "0.5rem" }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#6b7280",
                }}
              >
                Address
              </Typography>
              <Typography sx={{ marginTop: "0.25rem", color: "#111827" }}>
                House no. 140 puja shree
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "50%", paddingRight: "0.5rem" }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#6b7280",
                }}
              >
                Locality/Town
              </Typography>
              <Typography sx={{ marginTop: "0.25rem", color: "#111827" }}>
                CTO
              </Typography>
            </Box>
            <Box sx={{ width: "50%", paddingLeft: "0.5rem" }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#6b7280",
                }}
              >
                City/District
              </Typography>
              <Typography sx={{ marginTop: "0.25rem", color: "#111827" }}>
                Bhopal
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}
            >
              Type of Address
            </Typography>
            <Box
              sx={{
                marginTop: "0.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={<Radio />}
                label="Home"
                sx={{ marginRight: "1rem" }}
              />
              <FormControlLabel control={<Radio />} label="Office" />
            </Box>
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label="Make this my default Address"
            />
          </Box>
        </Box>

        <Box
          sx={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <Button
            variant="outlined"
            color="success"
            sx={{ borderRadius: "0.375rem" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ borderRadius: "0.375rem" }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditAddress;
