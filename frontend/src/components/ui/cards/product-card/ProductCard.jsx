import PropTypes from "prop-types";
import "./ProductCard.css";
import { useNavigate, useLocation } from "react-router-dom";
import WishListHeartIcon from "../../micro-elements/wishListHeartIcon/WishListHeartIcon";
import { useEffect, useState } from "react";
import rating_star from "../../../../assets/images/ratingStar.svg";
import { useSelector } from "react-redux";
import { addToCart, getCart } from "../../../../services/user/userAPI";
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
  const [isHover, setIsHover] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
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

    if (id) checkIfInCart();
  }, [id]);

  useEffect(() => {
    setIsHover(location.pathname.includes("user/wishlist"));
  }, [location.pathname]);

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
      style={{
        backgroundColor: isHover ? "white" : "",
        boxShadow: isHover ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "none",
        borderRadius: isHover ? "0.4rem" : "0rem",
      }}
      className="productCard_container"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Rating */}
      <div className="rating_box">
        <div>4.5</div>
        <figure>
          <img src={rating_star} alt="Rating Star" />
        </figure>
      </div>

      {/* Wishlist Icon */}
      <section>
        <WishListHeartIcon
          productId={id}
          isWishlist={isAddedToWishlist}
          refreshWishlist={refreshWishlist}
        />
      </section>

      {/* Product Image */}
      <figure>
        <img
          style={{ transform: isHover ? "scale(1.5)" : "scale(1)" }}
          src={picture}
          alt={title}
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
          style={{ visibility: isHover ? "visible" : "hidden" }}
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
