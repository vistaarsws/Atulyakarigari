// import React from "react";

// const Progress = () => {
//   const containerStyle = {
//     display: "flex",
//     alignItems: "center",
//     fontSize: "16px",
//     fontFamily: "Arial, sans-serif",
//     backgroundColor: "#f7f7f7",
//     justifyContent: "center",
//     height: "10vh",
//     margin: "0",
//   };

//   const activeStyle = {
//     color: "#60a487",
//   };

//   const inactiveStyle = {
//     color: "#888888",
//   };

//   const separatorStyle = {
//     color: "#888888",
//     fontSize: "12px",
//     margin: "0 10px",
//   };

//   return (
//     <div style={containerStyle}>
//       <span style={activeStyle}>Bag</span>
//       <span style={separatorStyle}>...............</span>
//       <span style={inactiveStyle}>Address</span>
//       <span style={separatorStyle}>................</span>
//       <span style={inactiveStyle}>Payment</span>
//     </div>
//   );
// };

// export default Progress;
// In Stepper.jsx

import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

const Progress = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Auto height on mobile, fixed height on larger screens
        height: { xs: "auto", md: "10vh" },
        backgroundColor: "#f7f7f7",
        p: 2,
        // Allow wrapping on mobile
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}
    >
      <Typography sx={{ color: "#60a487", mx: 1 }}>Bag</Typography>
      <Typography
        sx={{ color: "#888888", mx: 1, display: { xs: "none", sm: "inline" } }}
      >
        ...............
      </Typography>
      <Typography sx={{ color: "#888888", mx: 1 }}>Address</Typography>
      <Typography
        sx={{ color: "#888888", mx: 1, display: { xs: "none", sm: "inline" } }}
      >
        ................
      </Typography>
      <Typography sx={{ color: "#888888", mx: 1 }}>Payment</Typography>
    </Box>
  );
};
export default Progress;
