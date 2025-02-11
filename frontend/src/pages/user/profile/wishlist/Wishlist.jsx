import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import ProductCard from "../../../../components/ui/cards/product-card/ProductCard";
import { fetchWishlist } from "../../../../Redux/features/WishlistSlice";

import "./Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  // const [wishlistItems, setWishlistItems] = useState([]);
  const wishlist = useSelector((state) => state.wishlist.items);
  const userProfileToken = useSelector((state) => state.auth.token);

  // const getUserIdFromToken = useCallback(() => {
  //   if (!userProfileToken) {
  //     toast.error("Please log in to view your wishlist.");
  //     return null;
  //   }

  //   try {
  //     const decodedToken = jwtDecode(userProfileToken);
  //     return decodedToken?._id || null;
  //   } catch (error) {
  //     console.error("Error decoding token:", error.message || error);
  //     toast.error("Invalid user session.");
  //     return null;
  //   }
  // }, [userProfileToken]);

  // const fetchWishlistData = useCallback(async () => {
  //   const userId = getUserIdFromToken();
  //   if (!userId) return;

  //   try {
  //     const response = await getUserWishlist(userId);
  //     console.log("wislist page response", response);
  //     const wishlist = response?.data?.data?.wishlist || null;
  //     if (response?.data?.success && wishlist) {
  //       setWishlistItems(wishlist.items || []);
  //     } else {
  //       setWishlistItems([]);
  //       toast.info("Your wishlist is empty.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching wishlist data:", error.message || error);
  //     toast.error("Failed to fetch wishlist data. Please try again.");
  //   }
  // }, []);

  useEffect(() => {
    if (userProfileToken) {
      dispatch(fetchWishlist(userProfileToken));
    }
  }, [userProfileToken, dispatch]);

  const renderWishlistItems = () =>
    wishlist.map((product) => (
      <ProductCard
        key={product._id}
        id={product._id}
        title={product.name || "Unnamed Product"}
        picture={product.images?.[0] || "fallback_image_url"}
        price={product.priceAfterDiscount || product.price || "N/A"}
        isAddedToWishlist={true}
        priceAfterDiscount={product.priceAfterDiscount}
      />
    ));

  return (
    <div
      className={`wishlist_container ${wishlist.length > 3 ? "responsiveLayout" : ""}`}
    >
      {wishlist.length > 0 ? (
        renderWishlistItems()
      ) : (
        <p className="empty_message">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
