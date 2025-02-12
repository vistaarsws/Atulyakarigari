import { FaRobot } from "react-icons/fa";
import { Container, Typography, Button, Box } from "@mui/material";

export default function PageNotFound() {
  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        p: 4,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FaRobot size={120} color="#6D001D" style={{ animation: "bounce 1.5s infinite" }} />
        <Typography variant="h1" component="div" sx={{ fontWeight: "bold", color: "#6D001D", mt: 2 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "medium", color: "#6D001D", mt: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mt: 2, color: "#6D001D" }}>
          Oops! Our friendly robot seems lost. The page you are looking for might have been moved, renamed, or doesn’t exist.
        </Typography>
        <Button
          variant="contained"
          href="/"
          sx={{ mt: 4, px: 4, py: 2, fontSize: "1.2rem", borderRadius: "30px", backgroundColor: "#6D001D", '&:hover': { backgroundColor: "#6D001D" } }}
        >
          Return Home
        </Button>
      </Box>
    </Container>
  );
}
