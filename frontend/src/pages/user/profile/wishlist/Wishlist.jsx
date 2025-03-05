import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../../../Redux/features/WishlistSlice";
import ProductCard from "../../../../components/ui/cards/product-card/ProductCard";
import { FaHeartBroken } from "react-icons/fa";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const userProfileToken = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (userProfileToken) {
      dispatch(fetchWishlist(userProfileToken));
    }
  }, [userProfileToken, dispatch]);

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      {wishlist.length > 0 ? (
        <div
          className={`wishlist_container ${
            wishlist.length > 3 ? "responsiveLayout" : ""
          }`}
        >
          {wishlist.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              title={product.name || "Unnamed Product"}
              picture={product.images?.[0] || "fallback_image_url"}
              price={product.priceAfterDiscount || product.price || "N/A"}
              isAddedToWishlist={true}
              priceAfterDiscount={product.priceAfterDiscount}
            />
          ))}
        </div>
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
          <FaHeartBroken size={100} color="#6D001D" />
          <Typography variant="h5" fontWeight="bold" mt={2}>
            Your wishlist is empty.
          </Typography>
          <Typography sx={{ color: "gray", mt: 1 }}>
            Start adding your favorite products now!
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#60A487",
              color: "white",
              mt: 3,
              "&:hover": { backgroundColor: "#d8541e" },
            }}
            component={Link}
            to="/"
          >
            Browse Products
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Wishlist;