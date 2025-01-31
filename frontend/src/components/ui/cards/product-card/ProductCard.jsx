import PropTypes from "prop-types";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import WishListHeartIcon from "../../micro-elements/wishListHeartIcon/WishListHeartIcon";
import { useEffect, useState } from "react";
import rating_star from "../../../../assets/images/ratingStar.svg";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import { addToCart, getCart } from "../../../../services/user/userAPI"; // Assuming you have a function to get cart items
import { formatPrice } from "../../../../utils/helpers";
function ProductCard({
  title = "Product Title",
  shortDescription = "Short description here...",
  picture = "",
  price = 0,
  offer_inPercent = 0,
  id = "",
  isAddedToWishlist = false,
  priceAfterDiscount = price,
  fetchWishlist,
}) {
  const [isHover, setIsHover] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.token);
  const addToCartHandler = async (productId, quantity = 1) => {
    try {
      if (!authToken) {
        console.error("No user profile token found");
        return;
      }
      const { _id } = jwtDecode(authToken);
      if (!_id) {
        console.error("Invalid token structure");
        return;
      }
      await addToCart(productId, quantity);
      setIsInCart(true);
    } catch (err) {
      console.log(err.message);
    }
  };
  const checkIfInCart = async () => {
    try {
      const response = await getCart();
      const cartItems = response.data.data.items;
      if (Array.isArray(cartItems)) {
        const productInCart = cartItems.some((item) => item.productId === id);
        if (productInCart) {
          setIsInCart(true);
        }
      } else {
        console.error("cartItems is not an array:", cartItems);
      }
    } catch (err) {
      console.log("Error fetching cart items:", err.message);
    }
  };
  useEffect(() => {
    checkIfInCart();
    // Check if the URL contains "user/wishlist"
    const path = window.location.pathname;
    if (path.includes("user/wishlist")) {
      setIsHover(true);
    } else {
      setIsHover(false);
    }
  }, []);
  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (isInCart) {
      navigate("/view-cart");
    } else {
      addToCartHandler(id);
    }
  };
  return (
    <>
      <div
        style={{
          backgroundColor: isHover === true ? "white" : "",
          boxShadow:
            isHover === true ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "none",
          borderRadius: isHover === true ? "0.4rem" : "0rem",
        }}
        className="productCard_container"
        onClick={() => {
          navigate(`/product/${id}`);
        }}
      >
        <div className="rating_box">
          <div>4.5</div>
          <figure>
            <img src={rating_star} alt="Rating Star" />
          </figure>
        </div>
        <section>
          <div>
            <WishListHeartIcon
              productId={id}
              isWishlist={isAddedToWishlist}
              fetchWishlist={fetchWishlist}
            />
          </div>
        </section>
        <figure>
          <img
            style={{ transform: isHover === true && "scale(1.5)" }}
            src={picture}
            alt=""
          />
        </figure>
        <article>
          <h1>{title}</h1>
          <p>{shortDescription}</p>
          <div>
            <h2>{formatPrice(priceAfterDiscount)}</h2>
            <strike>{formatPrice(price)}</strike>
            <h4>(-{offer_inPercent}%)</h4>
          </div>
        </article>
        <div className={`${isAddedToWishlist ? "wistListBtnStyle" : ""} `}>
          <button
            onClick={handleButtonClick}
            style={{ visibility: isHover === true && "visible" }}
          >
            {isInCart ? "Go to cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </>
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
  fetchWishlist: PropTypes.func,
};
export default ProductCard;