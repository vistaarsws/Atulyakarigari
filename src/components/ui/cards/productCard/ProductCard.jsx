import PropTypes from "prop-types";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import WishListHeartIcon from "../../micro_elements/wishListHeartIcon/wishListHeartIcon";
import PreviewEyeIcon from "../../micro_elements/previewEyeIcon/previewEyeIcon";

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

function ProductCard({ title, picture, price, id }) {
  const navigate = useNavigate();

  // const [isAddedToWishList, setIsAddedToWishList] = useState(false);

  // const addToWishListHandler = () => {
  //   setIsAddedToWishList(!isAddedToWishList);
  // };

  return (
    <>
      <div
        className="productCard_container"
        onClick={() => {
          navigate(`/product/${id}`);
        }}
      >
        <section>
          <div>
            <WishListHeartIcon />
          </div>
          <div>
            <PreviewEyeIcon />
          </div>
        </section>
        <figure>
          <img src={picture} alt="" />
        </figure>
        <article>
          <h1>{title}</h1>
          <hr />
          <h2>₹{price}</h2>
        </article>
        <div>
          <button>Add to cart</button>
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
