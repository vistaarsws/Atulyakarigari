import PropTypes from "prop-types";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import WishListHeartIcon from "../../micro-elements/wishListHeartIcon/WishListHeartIcon";
import { useEffect, useState } from "react";
import rating_star from "../../../../assets/images/ratingStar.svg";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { addToCart } from "../../../../services/user/userAPI";

function ProductCard({
  title = "Product Title",
  shortDescription = "Short description here...",
  picture = "",
  price = 0,
  offer_inPercent = 0,
  id = "",
  isAddedToWishlist = false,
  priceAfterDiscount = price,
  fetchWishlistData = () => {},
}) {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.token);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  

  const addToCartHandler = async (productId = { id }, quantity) => {
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
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    // Check if the URL contains "user/wishlist"
    const path = window.location.pathname;
    if (path.includes("user/wishlist")) {
      setIsHover(true);
    } else {
      setIsHover(false);
    }
  }, []);

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
              fetchWishlist={fetchWishlistData}
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
            onClick={(e) => {
              e.stopPropagation();
              addToCartHandler(id);
            }}
            style={{ visibility: isHover === true && "visible" }}
          >
            Add to cart
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
  fetchWishlistData: PropTypes.func,
};

ProductCard.defaultProps = {
  shortDescription: "Short description here...",
  offer_inPercent: 0,
  isAddedToWishlist: false,
  fetchWishlistData: () => {},
};

export default ProductCard;
