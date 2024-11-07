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
  Checkbox,
} from "@mui/material";
import { margin, styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import TEST_IMG1 from "../../assets/images/banarshi sharee.png";
import TEST_IMG2 from "../../assets/images/Necklace.png";
import TEST_IMG3 from "../../assets/images/Necklace1.png";
import useMediaQuery from "@mui/material/useMediaQuery";

const theme = createTheme({
  typography: { fontFamily: "Lato" },
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
  padding: useMediaQuery("(max-width: 458px)") ? "1rem !important" : "2rem",
  marginBottom: useMediaQuery("(max-width: 458px)") ? "2rem" : theme.spacing(2),
  position: "relative",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  borderRadius: 8,
  backgroundColor: "#f4f4f4",
  maxWidth: "lg",
  height: useMediaQuery("(max-width: 458px)") ? "13rem" : "23rem",
  alignItems: useMediaQuery("(max-width: 458px)") ? "start" : "center",
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
const ProductImage = styled("img")(({ theme }) => ({
  objectFit: "contain",
  objectPosition: "center",
  height: "100%",
  width: useMediaQuery("(max-width: 458px)") ? "100%" : "",

  // Added responsive styling for mobile
  [theme.breakpoints.down("sm")]: {},
}));
const ProductImageWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  flexBasis: useMediaQuery("(max-width: 458px)") ? "30%" : "25%",
}));
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
const ProductCard = ({ product }) => {
  const is458px = useMediaQuery("(min-width: 458px)");

  return (
    <StyledCard>
      <ProductImageWrapper>
        <ProductImage src={product?.image} alt={product?.name} />
        <Checkbox
          sx={{
            position: "absolute",
            top: useMediaQuery("(max-width: 458px)") ? "1rem" : 28,
            left: useMediaQuery("(max-width: 458px)") ? "1rem" : 28,
            padding: 0,
            color: "white",
            zIndex: 1,
            "&.Mui-checked": {
              color: "#6d001d",
            },
          }}
          size="large"
        />
      </ProductImageWrapper>{" "}
      <CardContent
        sx={{
          ml: useMediaQuery("(max-width: 458px)") ? "" : "1rem",
          flexBasis: useMediaQuery("(max-width: 458px)") ? "70%" : "",
          // padding: "1rem 1rem 1rem 0", // paddingBottom: 0, // Optional, already handled by padding: 0,
          // pb: "1rem !important",
          padding: "0 0 0  1rem!important",
        }}
      >
        <CloseButton size="small">
          <CloseIcon fontSize="small" />
        </CloseButton>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "14px",
            color: "rgba(56, 55, 55, 1)",
          }}
        >
          {product?.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6f6f6f",
            fontSize: useMediaQuery("(max-width: 458px)") ? "1rem" : "12px",
            my: useMediaQuery("(max-width: 458px)") ? "" : 1,
            fontWeight: 400,
            lineHeight: "18px",
            height: "2rem", // You can adjust the height based on how many lines you want to show
            overflow: "hidden", // Hides the overflowed content
            textOverflow: "ellipsis", // Adds the ellipsis after the text is truncated
            display: "-webkit-box", // Creates a multi-line box for truncation
            WebkitBoxOrient: "vertical", // Ensures text wraps vertically
            WebkitLineClamp: 1, // Limits the number of lines (change this number to suit your needs)
          }}
        >
          {product?.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "space-between",
            gap: useMediaQuery("(max-width: 458px)") ? 0 : 4,

            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: useMediaQuery("(max-width: 458px)") ? "" : 4,
              // my: isMobile ? 0 : 2,
            }}
          >
            <Typography
              sx={{
                color: "rgba(56, 55, 55, 1)",
                fontWeight: 600,
                fontSize: "16px",
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
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "12px",
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: useMediaQuery("(max-width: 458px)") ? 0 : 1,
              }}
            >
              <CheckIcon color="success" sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                sx={{
                  ml: useMediaQuery("(max-width: 458px)") ? "0.2rem" : 1,
                  color: "#6f6f6f",
                  fontSize: useMediaQuery("(max-width: 330px)")
                    ? "10px"
                    : "12px",
                  fontWeight: 400,
                }}
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
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

const OrderCard = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          // maxWidth: "md",
          // margin: "auto",
          padding: "2 2 2 0",
          bgcolor: "#fff",
          // height: "65vh"
          height: { xs: "auto", sm: "65vh" },
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
