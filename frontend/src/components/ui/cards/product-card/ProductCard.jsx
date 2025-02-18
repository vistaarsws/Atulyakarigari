import PropTypes from "prop-types";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import WishListHeartIcon from "../../micro-elements/wishListHeartIcon/WishListHeartIcon";
import { useEffect, useState } from "react";
import rating_star from "../../../../assets/images/ratingStar.svg";
import { getReviewById } from "../../../../services/user/userAPI";
import { formatPrice } from "../../../../utils/helpers";

function ProductCard({
  title = "Product Title",
  shortDescription = "Short description here...",
  picture = "",
  price = 0,
  offer_inPercent = 0,
  id,
  priceAfterDiscount = price,
}) {
  const navigate = useNavigate();

  const [reviewData, setReviewData] = useState(null);

  const getReview = async () => {
    try {
      const response = await getReviewById(id);
      setReviewData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching review data:", error.message);
    }
  };

  useEffect(() => {
    getReview();
  }, [id]);

  return (
    <div
      className="productCard_container"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="rating_box">
        <div>{reviewData?.averageRating}</div>
        <figure>
          <img src={rating_star} alt="Rating Star" />
        </figure>
      </div>
      <section>
        <WishListHeartIcon productId={id} />
      </section>

      <figure>
        <img src={picture} alt="" />
      </figure>
      <article>
        <h1>{title}</h1>
        {/* <p>{shortDescription}</p> */}
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
  priceAfterDiscount: PropTypes.number.isRequired,
};
export default ProductCard;
