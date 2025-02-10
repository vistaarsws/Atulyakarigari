import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

import ProductCard from "../../../../components/ui/cards/product-card/ProductCard";
import { getUserWishlist } from "../../../../services/user/userAPI";

import "./Wishlist.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const userProfileToken = useSelector((state) => state.auth.token);

  const getUserIdFromToken = useCallback(() => {
    if (!userProfileToken) {
      toast.error("Please log in to view your wishlist.");
      return null;
    }

    try {
      const decodedToken = jwtDecode(userProfileToken);
      return decodedToken?._id || null;
    } catch (error) {
      console.error("Error decoding token:", error.message || error);
      toast.error("Invalid user session.");
      return null;
    }
  }, [userProfileToken]);

  const fetchWishlistData = useCallback(async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const response = await getUserWishlist(userId);
      const wishlist = response?.data?.data?.wishlist || null;
      if (response?.data?.success && wishlist) {
        setWishlistItems(wishlist.items || []);
      } else {
        setWishlistItems([]);
        toast.info("Your wishlist is empty.");
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error.message || error);
      toast.error("Failed to fetch wishlist data. Please try again.");
    }
  }, [getUserIdFromToken]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const renderWishlistItems = () =>
    wishlistItems.map((product) => (
      <ProductCard
        key={product._id}
        id={product._id}
        title={product.name || "Unnamed Product"}
        picture={product.images?.[0] || "fallback_image_url"}
        price={product.priceAfterDiscount || product.price || "N/A"}
        isAddedToWishlist={true}
        priceAfterDiscount={product.priceAfterDiscount}
        refreshWishlist={fetchWishlistData}
      />
    ));

  return (
    <div
      className={`wishlist_container ${wishlistItems.length > 3 ? "responsiveLayout" : ""}`}
    >
      {wishlistItems.length > 0 ? (
        renderWishlistItems()
      ) : (
        <p className="empty_message">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
