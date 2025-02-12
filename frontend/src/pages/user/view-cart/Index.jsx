import OrderCard from "./OrderCard";
import Payment from "./Payment";
import Stepper from "./Stepper";
import AddressComponent from "./AddressComponent";
import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../../../Redux/features/CartSlice";

const Index = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const cartData = useSelector((state) => state.cart);

  useEffect(() => {
    if (authToken) {
      console.log("Fetching cart data...");
      dispatch(fetchCart(authToken));
    }
  }, [authToken, dispatch]);

  return (
    <Box
      sx={{
        pt: {
          // xs: "4vh",
          sm: "0",
        },
      }}
    >
      <Stepper />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          // marginTop: "2rem",

          flexDirection: { xs: "column", md: "row" },
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            mb: { xs: 4, md: 0 },
            overflow: useMediaQuery("(max-width:768px)") ? "unset" : "scroll",
            scrollbarWidth: "none",
          }}
        >
          <AddressComponent />
          <OrderCard cartData={cartData} />
        </Box>
        <Box
          sx={{
            // Full width on mobile, 35% on larger screens
            width: { xs: "100%", md: "35%", marginBottom: "7rem" },
          }}
        >
          <Payment cartData={cartData} />
        </Box>
      </Box>
    </Box>
  );
};
export default Index;
