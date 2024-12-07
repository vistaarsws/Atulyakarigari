import PropTypes from "prop-types";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import WishListHeartIcon from "../../micro_elements/wishListHeartIcon/wishListHeartIcon";
import { useEffect, useState } from "react";
import rating_star from "../../../../assets/images/ratingStar.svg";

// const productReference = {
//     _id: "aaaaa",
//     name: "Women Round Neck Cotton Top",
//     description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
//     price: 100,
//     image: [p_img1],
//     category: "Women",
//     subCategory: "Topwear",
//     sizes: ["S", "M", "L"],
//     date: 1716634345448,
//     bestseller:true}

function ProductCard({
  title,
  shortDescription = "Traditional Banarasi elegance for a glow.",
  picture,
  price,
  offer_inPercent = 12,
  id,
  isAddedToWislist,
}) {
  const [isHover, setIsHover] = useState(false);
  const [isMobileView, setIsMobileView] = useState();
  const navigate = useNavigate();
  // const [isAddedToWishList, setIsAddedToWishList] = useState(false);
  // const addToWishListHandler = () => {
  //   setIsAddedToWishList(!isAddedToWishList);
  // };

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
            <WishListHeartIcon />
          </div>
          {/* <div>
            <input
              type="checkbox"
              id="quickView"
              name="quickView-checkbox"
              value="quickView-button"
            />
            <label htmlFor="quickView" className="container">
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3C7.42135 3 6.86639 3.21071 6.45722 3.58579C6.04805 3.96086 5.81818 4.46957 5.81818 5C5.81818 5.53043 6.04805 6.03914 6.45722 6.41421C6.86639 6.78929 7.42135 7 8 7C8.57865 7 9.13361 6.78929 9.54278 6.41421C9.95195 6.03914 10.1818 5.53043 10.1818 5C10.1818 4.46957 9.95195 3.96086 9.54278 3.58579C9.13361 3.21071 8.57865 3 8 3ZM8 8.33333C7.03558 8.33333 6.11065 7.98214 5.4287 7.35702C4.74675 6.7319 4.36364 5.88406 4.36364 5C4.36364 4.11595 4.74675 3.2681 5.4287 2.64298C6.11065 2.01786 7.03558 1.66667 8 1.66667C8.96442 1.66667 9.88935 2.01786 10.5713 2.64298C11.2532 3.2681 11.6364 4.11595 11.6364 5C11.6364 5.88406 11.2532 6.7319 10.5713 7.35702C9.88935 7.98214 8.96442 8.33333 8 8.33333ZM8 0C4.36364 0 1.25818 2.07333 0 5C1.25818 7.92667 4.36364 10 8 10C11.6364 10 14.7418 7.92667 16 5C14.7418 2.07333 11.6364 0 8 0Z"
                  fill="#6F6F6F"
                />
              </svg>
            </label>
          </div> */}
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
            <h2>₹{price - price * offer_inPercent * 0.01}</h2>
            <strike>₹{price}</strike>
            <h4>(-{offer_inPercent}%)</h4>
          </div>
        </article>
        <div className={`${isAddedToWislist ? "wistListBtnStyle" : ""} `}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/buy-now");
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
  title: PropTypes.string,
  picture: PropTypes.string,
  price: PropTypes.number,
  id: PropTypes.string,
};

export default ProductCard;
