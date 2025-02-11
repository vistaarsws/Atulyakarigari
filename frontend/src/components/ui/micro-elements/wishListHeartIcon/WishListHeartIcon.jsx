import { useEffect, useState } from "react";
import "./WishListHeartIcon.css";
import { toggleWishlistItem } from "../../../../services/user/userAPI";
import { fetchWishlist } from "../../../../Redux/features/WishlistSlice";
import { useDispatch, useSelector } from "react-redux";

export default function WishListHeartIcon({ productId, isWishlist }) {
  const dispatch = useDispatch();
  const userProfileToken = useSelector((state) => state.auth.token);
  const [wishlist, setWishlist] = useState(isWishlist);

  useEffect(() => {
    setWishlist(isWishlist);
  }, [isWishlist]);

  const toggleWishlistHandler = async (e) => {
    e.stopPropagation();
    try {
      const updatedWishlist = !wishlist;
      setWishlist(updatedWishlist);
      await toggleWishlistItem(productId);
      dispatch(fetchWishlist(userProfileToken));
    } catch (error) {
      console.error("Error toggling wishlist item:", error.message || error);
      setWishlist(isWishlist);
    }
  };

  useEffect(() => {
    dispatch(fetchWishlist(userProfileToken));
  }, [wishlist, dispatch]);

  return (
    <div className="wishListHeart_box" onClick={toggleWishlistHandler}>
      <input
        type="checkbox"
        id={`favorite-${productId}`}
        name="favorite-checkbox"
        checked={wishlist}
        readOnly
      />
      <label htmlFor={`favorite-${productId}`} className="container">
        <svg
          width="14"
          height="12"
          viewBox="0 0 14 12"
          xmlns="http://www.w3.org/2000/svg"
          // fill={wishlist ? "#c00000" : "none"}
        >
          <path d="M0 4.07934C0 7.46909 2.8136 9.27546 4.87321 10.8923C5.6 11.4628 6.3 12 7 12C7.7 12 8.4 11.4628 9.12681 10.8923C11.1864 9.27546 14 7.46909 14 4.07934C14 0.689569 10.1499 -1.71439 7 1.5445C3.85011 -1.71439 0 0.689569 0 4.07934Z" />
        </svg>
      </label>
    </div>
  );
}
