import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

const Progress = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const routes = useLocation().pathname;
  const isSmallScreen = useMediaQuery("(max-width:420px)");
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f7f7f7",
        // p: 2,
        flexWrap: isMobile ? "wrap" : "nowrap",
        height: "7vh",
      }}
    >
      <Typography
        sx={{
          color: "#60a487",
          mx: 1,
          fontSize: isSmallScreen ? "11px" : "16px",
        }}
      >
        Bag
      </Typography>
      <Box
        sx={{
          color: routes == "/place-order" ? "#60a487" : "#888888",
          mx: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{ fontSize: isSmallScreen ? "11px" : "16px", pb: "10%" }}
        >
          .......................
        </Typography>
      </Box>
      <Typography
        sx={{
          color: routes == "/place-order" ? "#60a487" : "#888888",
          mx: 1,
          fontSize: isSmallScreen ? "11px" : "16px",
        }}
      >
        Address
      </Typography>
      <Box
        sx={{
          color: "#888888",
          mx: 1,
          display: "inline",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontSize: isSmallScreen ? "11px" : "16px", pb: "10%" }}
        >
          ........................
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "#888888",
          mx: 1,
          fontSize: isSmallScreen ? "11px" : "16px",
        }}
      >
        Payment
      </Typography>
    </Box>
  );
};
export default Progress;
