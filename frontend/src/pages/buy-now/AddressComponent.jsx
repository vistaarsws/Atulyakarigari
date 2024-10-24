import { Box, Button } from "@mui/material";
import React from "react";

const AddressComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        // alignItems: "center",
        backgroundColor: "#fff",
        marginBottom: "1rem",
        // border: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          fontSize: "14px",
          color: "#6f6f6f",
          lineHeight: "25px",
          fontWeight: 500,
          mb: { xs: 2, sm: 0 },
        }}
      >
        <p>
          Deliver to:{" "}
          <strong
            style={{
              fontWeight: 900,
              color: "#383737",
            }}
          >
            Mayuri Srivastava, 462030
          </strong>
        </p>
        <p>House number 140 Puja shree nagar cto Bairagarh, Bhopal</p>
      </Box>

      <Button
        variant="outlined"
        sx={{
          height: "35px",
          padding: "9px 20px",
          color: "#73af96",
          borderColor: "#73af96",
          fontSize: "16px",
          fontWeight: 400,
          textAlign: "left",
          width: { xs: "100%", sm: "auto" },
          textTransform: "capitalize",
          "&:hover": {
            color: "#ffffff",
            backgroundColor: "#60a487",
            borderColor: "#60a487",
          },
        }}
      >
        Change Address
      </Button>
    </Box>
  );
};

export default AddressComponent;
