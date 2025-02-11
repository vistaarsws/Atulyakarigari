import OrderCard from "./OrderCard";
import Payment from "./Payment";
import Stepper from "./Stepper";
import AddressComponent from "./AddressComponent";
import { Box, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { getCart } from "../../../services/user/userAPI";
import { fetchCart } from "../../../Redux/features/CartSlice";

const Index = () => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const cartData = useSelector((state) => state.cart);
  console.log("CCCCCCCCCCCCCCCCC", cartData);

  // const [cartData, setCartData] = useState(null);

  // const fetchCartData = async () => {
  //   try {
  //     if (!authToken) {
  //       console.error("No user profile token found");
  //       return;
  //     }

  //     const { _id } = jwtDecode(authToken);
  //     if (!_id) {
  //       console.error("Invalid token structure");
  //       return;
  //     }

  //     const response = await getCart(_id);
  //     console.log(response);

  //     setCartData(response?.data?.data);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  useEffect(() => {
    if (authToken) {
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
          <OrderCard />
        </Box>
        <Box
          sx={{
            // Full width on mobile, 35% on larger screens
            width: { xs: "100%", md: "35%", marginBottom: "7rem" },
          }}
        >
          <Payment />
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
