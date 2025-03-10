import OrderCard from "./OrderCard";
import Payment from "./Payment";
import Stepper from "./Stepper";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../../Redux/features/CartSlice";
import { FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";

const Index = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const cartData = useSelector((state) => state.cart);
  const isMobile = useMediaQuery("(max-width:768px)");
  const mobileHeight = useMediaQuery("(max-width:900px)");
  useEffect(() => {
    if (authToken && !cartData.items.length) {
      dispatch(fetchCart(authToken));
    }
  }, [authToken, dispatch, cartData.items.length]);

  return (
    <Box
      sx={{
        pt: { sm: "0" },
        height: useMediaQuery("(max-width:900px)") ? "unset" : "90vh",
      }}
    >
      <Stepper />

      {cartData.items?.length > 0 ? (
        <Box
          sx={{
            marginTop: "2rem",
            height: mobileHeight ? "100%" : "80vh",
            overflowY: "hidden",
            scrollbarWidth: "none",
            boxShadow: "none",
            display: "flex",
            justifyContent: "space-around",
            flexDirection: { xs: "column", md: "row" },
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "60%" },
              mb: { xs: 4, md: 0 },
              overflow: isMobile ? "unset" : "scroll",
              scrollbarWidth: "none",
            }}
          >
            <OrderCard cartData={cartData} />
          </Box>
          <Box
            sx={{
              width: {
                xs: "100%",
                md: "35%",
                height: "83vh",
                overflowY: "scroll",
              },
            }}
          >
            <Payment />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
          <FaShoppingBag size={100} color="#6D001D" />
          <Typography variant="h5" fontWeight="bold" mt={2}>
            Your cart is currently empty.
          </Typography>
          <Typography sx={{ color: "gray", mt: 1 }}>
            Check out all the available products and buy some in the shop.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#60A487",
              color: "white",
              mt: 3,
              "&:hover": { backgroundColor: "#46846a" },
            }}
            component={Link}
            to="/"
          >
            Return to Home
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Index;
