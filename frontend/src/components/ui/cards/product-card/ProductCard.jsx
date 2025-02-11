import PropTypes from "prop-types";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import WishListHeartIcon from "../../micro-elements/wishListHeartIcon/WishListHeartIcon";
import { useEffect, useState } from "react";
import rating_star from "../../../../assets/images/ratingStar.svg";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, getCart, getReviewById } from "../../../../services/user/userAPI";
import { formatPrice } from "../../../../utils/helpers";
function ProductCard({
  title = "Product Title",
  shortDescription = "Short description here...",
  picture = "",
  price = 0,
  offer_inPercent = 0,
  id = "",
  priceAfterDiscount = price,
  isAddedToWishlist,
  refreshWishlist,
}) {
 
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [reviewData, setReviewData] = useState(null);

  const getReview = async () => {
    try {
      const response = await getReviewById(id); 
      setReviewData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching review data:", error.message);
    }
  }
  
  const checkIfInCart = async () => {
    try {
      const response = await getCart();
      const cartItems = response?.data?.data?.items || [];
      if (Array.isArray(cartItems)) {
        setIsInCart(cartItems.some((item) => item.productId === id));
      }
    } catch (err) {
      console.error("Error fetching cart items:", err.message);
    }
  };
  useEffect(() => {
    getReview();
    if (id) checkIfInCart();
  }, [id]);
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isInCart) {
      navigate("/view-cart");
    } else {
      try {
        await addToCart(id, 1);
        setIsInCart(true);
      } catch (err) {
        console.error("Error adding to cart:", err.message);
      }
    }
  };
  return (
    <div
      
      className="productCard_container"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Rating */}
      <div className="rating_box">
        <div>{reviewData?.averageRating}</div>
        <figure>
          <img src={rating_star} alt="Rating Star" />
        </figure>
      </div>
      {/* Wishlist Icon */}
      <section>
      <WishListHeartIcon productId={id} isWishlist={isAddedToWishlist} />
      </section>
      {/* Product Image */}
      <figure>
        <img
          
          src={picture}
          alt=""
        />
      </figure>
      {/* Product Details */}
      <article>
        <h1>{title}</h1>
        <p>{shortDescription}</p>
        <div>
          <h2>{formatPrice(priceAfterDiscount)}</h2>
          {offer_inPercent > 0 && (
            <>
              <strike>{formatPrice(price)}</strike>
              <h4>(-{offer_inPercent}%)</h4>
            </>
          )}
        </div>
      </article>
      {/* Add to Cart Button */}
      <div className={isAddedToWishlist ? "wistListBtnStyle" : ""}>
        <button
          onClick={handleAddToCart}
          className={isInCart ? "in-cart" : ""}
        >
          {isInCart ? "Go to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
ProductCard.propTypes = {
  title: PropTypes.string.isRequired,
  shortDescription: PropTypes.string,
  picture: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  offer_inPercent: PropTypes.number,
  id: PropTypes.string.isRequired,
  isAddedToWishlist: PropTypes.bool,
  priceAfterDiscount: PropTypes.number.isRequired,
  refreshWishlist: PropTypes.func,
};
export default ProductCard;
