import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import TEST_IMG1 from "../../assets/images/banarshi sharee.png";
import TEST_IMG2 from "../../assets/images/Necklace.png";
import TEST_IMG3 from "../../assets/images/Necklace1.png";

const theme = createTheme({
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  position: "relative",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  borderRadius: 8,
  backgroundColor: "#f4f4f4",

  maxWidth: "lg",
}));

const CloseButton = styled(IconButton)({
  position: "absolute",
  top: 8,
  right: 8,
  color: "#666666",
  padding: 4,
});

const QuantityContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const QuantityButton = styled(Button)({
  minWidth: 32,
  height: 32,
  padding: 0,
  border: "none",
  color: "#333333",
  fontSize: "15px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
});

const productData = [
  {
    id: 1,
    name: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    price: 27000,
    quantity: 10,
    returnPeriod: 10,
    deliveryDates: "5 Oct - 7 Oct",
    image: TEST_IMG1,
  },
  {
    id: 2,
    name: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    price: 7000,
    quantity: 10,
    returnPeriod: 10,
    deliveryDates: "5 Oct - 7 Oct",
    image: TEST_IMG2,
  },
  {
    id: 3,
    name: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    price: 3000,
    quantity: 10,
    returnPeriod: 10,
    deliveryDates: "5 Oct - 7 Oct",
    image: TEST_IMG3,
  },
  {
    id: 4,
    name: "BANARSI SAARI",
    description:
      "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
    price: 27000,
    quantity: 10,
    returnPeriod: 10,
    deliveryDates: "5 Oct - 7 Oct",
    image: TEST_IMG1,
  },
  // Add more product objects here if needed
];

const ProductCard = ({ product }) => (
  <StyledCard>
    <img
      style={{ margin: "2rem", objectFit: "contain" }}
      height="183px"
      width="149px"
      src={product?.image}
      alt={product?.name}
    />
    <CardContent sx={{ flex: 1 }}>
      <CloseButton size="small">
        <CloseIcon fontSize="small" />
      </CloseButton>
      <Typography
        sx={{ fontWeight: 600, fontSize: "14px", color: "rgba(56, 55, 55, 1)" }}
      >
        {product?.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "#6f6f6f",
          fontSize: 12,
          my: 1,
          fontWeight: 400,
          lineHeight: "18px",
        }}
      >
        {product?.description}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 4, my: 2 }}>
        <Typography
          sx={{
            color: "rgba(56, 55, 55, 1)",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "21px",
          }}
        >
          {product?.price?.toLocaleString()}
        </Typography>
        <QuantityContainer>
          <QuantityButton variant="outlined">-</QuantityButton>
          <Typography variant="outlined" fontSize="14px">
            {product?.quantity}
          </Typography>
          <QuantityButton variant="outlined">+</QuantityButton>
        </QuantityContainer>
      </Box>
      <Typography
        variant="body2"
        sx={{
          mt: 1.5,
          color: "text.secondary",
          fontSize: "12px",
          lineHeight: "21px",
          fontWeight: 400,
        }}
      >
        <span
          style={{
            fontWeight: 900,
            color: "rgb(56, 55, 55)",
            fontSize: "12px",
          }}
        >
          {product.returnPeriod} Days{" "}
        </span>
        return available
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <CheckIcon color="success" sx={{ fontSize: 18 }} />
        <Typography
          variant="body2"
          sx={{ ml: 1, color: "#6f6f6f", fontSize: "12px", fontWeight: 400 }}
        >
          Delivery Between
          <span
            style={{
              fontWeight: 900,
              color: "rgb(56, 55, 55)",
              lineHeight: "21px",
              fontSize: "12px",
            }}
          >
            {" "}
            {product.deliveryDates}
          </span>
        </Typography>
      </Box>
    </CardContent>
  </StyledCard>
);

const OrderCard = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: "md",
          margin: "auto",
          padding: 2,
          bgcolor: "#fff",
          height: "65vh",
          overflow: "scroll",
          scrollbarWidth: "none",
        }}
      >
        {productData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default OrderCard;
