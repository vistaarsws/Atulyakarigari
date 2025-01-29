import "./WishListHeartIcon.css";
import { toggleWishlistItem } from "../../../../services/user/userAPI";
import { useEffect, useState } from "react";

export default function WishListHeartIcon({
  productId,
  isWishlist,
  fetchWishlist,
}) {
  const [wishlist, setWishlist] = useState(isWishlist);

  useEffect(() => {
    // Sync the local state when the parent component updates the `isWishlist` prop.
    setWishlist(isWishlist);
  }, [isWishlist]);

  const toggleWishlistHandler = async (e) => {
    e.stopPropagation(); // Prevents the click event from propagating.
    try {
      const updatedWishlist = !wishlist;
      setWishlist(updatedWishlist); // Optimistically update the UI.
      await toggleWishlistItem(productId); // Send the request to toggle the wishlist state in the backend.
      const wishLi = fetchWishlist();
      console.log("EWWWW", wishLi);
    } catch (error) {
      console.error("Error toggling wishlist item:", error.message || error);
      // Rollback the state in case of an error.
      setWishlist(!wishlist);
    }
  };

  return (
    <>
      <div
        className="wishListHeart_box"
        onClick={(e) => {
          e.stopPropagation();
          setWishlist(!isWishlist);
          toggleWishlistItem(productId);
        }}
      >
        <input
          type="checkbox"
          id="favorite"
          name="favorite-checkbox"
          value="favorite-button"
          checked={wishlist}
          onChange={toggleWishlistHandler}
        />
        <label htmlFor="favorite" className="container">
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            // fill={wishlist ? "#c00000" : "none"}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 4.07934C0 7.46909 2.8136 9.27546 4.87321 10.8923C5.6 11.4628 6.3 12 7 12C7.7 12 8.4 11.4628 9.12681 10.8923C11.1864 9.27546 14 7.46909 14 4.07934C14 0.689569 10.1499 -1.71439 7 1.5445C3.85011 -1.71439 0 0.689569 0 4.07934Z" />
          </svg>
        </label>
      </div>
    </>
  );
}
