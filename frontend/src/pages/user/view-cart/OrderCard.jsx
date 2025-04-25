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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  removeFromTheCart,
  updateQuantityInCart,
} from "../../../Redux/features/CartSlice";
import { useState, useEffect } from "react";

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

const ProductImage = styled("img")(({ theme }) => ({
  objectFit: "contain",
  objectPosition: "center",
  height: "100%",
  width: useMediaQuery("(max-width: 458px)") ? "100%" : "",
  [theme.breakpoints.down("sm")]: {},
}));
const ProductImageWrapper = styled(Box)(({ theme }) => ({
  height: "100%",
  flexBasis: useMediaQuery("(max-width: 458px)") ? "30%" : "25%",
}));

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const cartItems = useSelector((state) => state.cart.items);
  const [productQuantity, setProductQuantity] = useState(1);
 

  //changes
  useEffect(() => {
    if (product?.productId) {
      const cartProduct = cartItems.find(
        (item) => item.productId === product.productId
      );
      if (cartProduct) {
        setProductQuantity(cartProduct.quantity);
      }
    }
  }, [product?.productId]);

  const removeFromCartHandler = async () => {
    try {
      if (!product?.productId) return;
      await dispatch(
        removeFromTheCart({
          authToken: authToken,
          productId: product.productId,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.productId}`);
  };

  const handleQuantity = async (productId, qty) => {
    try {
      if (qty < 1) return;
      await dispatch(updateQuantityInCart({ productId, quantity: qty }));
      await dispatch(fetchCart(authToken));
      setProductQuantity(qty);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
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
            paddingRight: "2rem",
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
            height: "2rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
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
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
              sx={{ borderRadius: "0.5rem" }}
            >
              <Button
                variant="outlined"
                sx={{
                  padding: "9px 15px",
                  borderColor: "#60a487",
                  color: "#60a487",
                  minWidth: "unset",
                  fontSize: "1.5rem",
                  lineHeight: 1,
                  "&:hover": {
                    color: "white",
                    backgroundColor: "#60a487",
                  },
                }}
                onClick={() =>
                  handleQuantity(product?.productId, productQuantity - 1)
                }
                disabled={productQuantity <= 1}
              >
                -
              </Button>

              <Typography sx={{ minWidth: "1.2rem", textAlign: "center" }}>
                {productQuantity}
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  padding: "9px 15px",
                  borderColor: "#60a487",
                  color: "#60a487",
                  minWidth: "unset",
                  fontSize: "1.5rem",
                  lineHeight: 1,

                  "&:hover": {
                    color: "white",
                    backgroundColor: "#60a487",
                  },
                }}
                onClick={() =>
                  handleQuantity(product?.productId, productQuantity + 1)
                }
              >
                +
              </Button>
            </Box>
          </Box>
          <Box>
            {product.expectedReturnDate >= 0 ? (
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
                    fontWeight: 500,
                    color: "rgb(56, 55, 55)",
                    fontSize: "12px",
                  }}
                >
                  {`Easy ${product?.expectedReturnDate} days returns and exchanges`}
                </span>
              </Typography>
            ) : (
              "No Return"
            )}
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
          height: { xs: "auto", sm: "75vh" },
          overflow: "scroll",
          scrollbarWidth: "none",
        }}
      >
        {cartData?.items?.length > 0 ? (
          cartData.items.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))
        ) : (
          <ProductCard key={cartData?._id} product={cartData} />
        )}
      </Box>
    </ThemeProvider>
  );
};
export default OrderCard;
