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
        height: { xs: "auto", md: "10vh" },
        backgroundColor: "#f7f7f7",
        p: 2,
        flexWrap: isMobile ? "wrap" : "nowrap",
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
      <Typography
        sx={{
          color: routes == "/place-order" ? "#60a487" : "#888888",
          mx: 1,
          display: "inline",
          fontSize: isSmallScreen ? "11px" : "16px",
        }}
      >
        ...............
      </Typography>
      <Typography
        sx={{
          color: routes == "/place-order" ? "#60a487" : "#888888",
          mx: 1,
          fontSize: isSmallScreen ? "11px" : "16px",
        }}
      >
        Address
      </Typography>
      <Typography
        sx={{
          color: "#888888",
          mx: 1,
          display: "inline",
          fontSize: isSmallScreen ? "11px" : "16px",
          alignItems: "center",
        }}
      >
        ................
      </Typography>
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
