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
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromTheCart } from "../../../Redux/features/CartSlice";
const theme = createTheme({
  typography: { fontFamily: "Lato" },
  palette: {
    primary: {
      main: "#1976D2",
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
  boxShadow: "0 2px 4px rgba(0,0,0,0)",
  // borderRadius: 8,
  backgroundColor: "#F4F4F4",
  maxWidth: "lg",
  height: useMediaQuery("(max-width: 458px)") ? "15rem" : "23rem",
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
  border: "1px solid #E0E0E0",
});
const QuantityButton = styled(Button)({
  minWidth: 32,
  height: 32,
  padding: 0,
  border: "none",
  color: "#333333",
  fontSize: "15px",
  "&:hover": {
    backgroundColor: "#F5F5F5",
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
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const removeFromCartHandler = () => {
    if (!product?.productId) {
      console.error("No product ID found");
      return;
    }

    dispatch(removeFromTheCart({ productId: product?.productId }));
  };

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };
  return (
    <StyledCard>
      <Box sx={{ height: "100%" }}>
        <ProductImageWrapper
          sx={{
            width: { xs: "100px", sm: "250px" },

            overflow: "hidden",
          }}
        >
          <ProductImage
            src={product?.images?.[0]}
            alt={product?.name}
            onClick={handleCardClick}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </ProductImageWrapper>
      </Box>
      <CardContent
        sx={{
          ml: useMediaQuery("(max-width: 458px)") ? "" : "1rem",
          flexBasis: useMediaQuery("(max-width: 458px)") ? "70%" : "",
          // padding: "1rem 1rem 1rem 0", // paddingBottom: 0, // Optional, already handled by padding: 0,
          // pb: "1rem !important",
          padding: "0 0 0  1rem!important",
        }}
      >
        <CloseButton onClick={removeFromCartHandler} size="small">
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
            color: "#6F6F6F",
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
          {product?.sku || "No sku ID available"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "space-between",
            gap: useMediaQuery("(max-width: 458px)") ? 0 : 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: useMediaQuery("(max-width: 458px)")
                ? "row"
                : "column",
              alignItems: "start",
              width: "100%",
              justifyContent: "space-between",
              gap: useMediaQuery("(max-width: 458px)") ? "" : 2,
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
              ₹{product?.price?.toLocaleString()}
            </Typography>
            <QuantityContainer
              sx={{
                borderRadius: "0.5rem",
              }}
            >
              <QuantityButton>-</QuantityButton>
              <Typography>{product?.quantity}</Typography>
              <QuantityButton>+</QuantityButton>
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
                10 Days
              </span>{" "}
              return available
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                mt: useMediaQuery("(max-width: 458px)") ? 0 : 1,
              }}
            >
              <CheckIcon
                color="success"
                sx={{ fontSize: 18, margin: "0.2rem 0" }}
              />
              <Typography
                variant="body2"
                sx={{
                  ml: useMediaQuery("(max-width: 458px)") ? "0.2rem" : 1,
                  color: "#6F6F6F",
                  fontSize: useMediaQuery("(max-width: 330px)")
                    ? "10px"
                    : "12px",
                  fontWeight: 400,
                }}
              >
                Delivery Between{" "}
                <span
                  style={{
                    fontWeight: 900,
                    color: "rgb(56, 55, 55)",
                    lineHeight: "21px",
                    fontSize: "12px",
                  }}
                >
                  5 Oct - 7 Oct
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};
const OrderCard = ({ cartData }) => {
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
        {cartData?.items?.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </Box>
    </ThemeProvider>
  );
};
export default OrderCard;
