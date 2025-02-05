import PropTypes from "prop-types";
import ProductCard from "../../../ui/cards/product-card/ProductCard";
import pattern from "../../../../assets/images/designPattern_1.svg";
import { EmblaSlider } from "../../../ui/slider/EmblaSlider";
import { useNavigate } from "react-router-dom";

import "./ProductSection.css";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getUserWishlist } from "../../../../services/user/userAPI";

// Utility function to handle product fallbacks
const formatProductData = (product) => ({
  id: product._id,
  title: product.name || "Unnamed Product",
  picture: product.images?.[0] || "default-image-url", // Fallback for image
  price: product.price || "N/A",
  shortDescription: product.description || "No Description",
  priceAfterDiscount: product.priceAfterDiscount || "N/A",
  offer_inPercent: product.discountPercentage || null,
});

export default function ProductSection({ productCategorySection, bgColor }) {
  const { title, subtitle, products, categoryId } = productCategorySection;
  const userProfileToken = useSelector((state) => state.auth.token);
  const [wishlist, setWishlist] = useState([]);

  const getUserIdFromToken = useCallback(() => {
    try {
      if (!userProfileToken) {
        toast.error("Please log in to view your wishlist.");
        return null;
      }

      const decodedToken = jwtDecode(userProfileToken);
      const userId = decodedToken?._id;

      if (!userId) {
        toast.error("Invalid user session.");
        return null;
      }

      return userId;
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
      const wishlistArray = response?.data?.data?.wishlist?.[0];

      console.log("Wishlist Data:", wishlistArray);

      if (response?.data?.success && wishlistArray?.items?.length > 0) {
        setWishlist(wishlistArray.items);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error.message || error);
    }
  }, []);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const productCards = products.map((product, index) => {
    // debugger;
    console.log("p", product._id);
    console.log("W", product._id);
    console.log("p", product._id);
    const isAddedToWishlist = wishlist.some((item) => item._id == product._id);

    console.log("isAddedToWishlist", isAddedToWishlist);
    return (
      <ProductCard
        key={index}
        {...formatProductData(product)}
        isAddedToWishlist={isAddedToWishlist}
        // fetchWishlist={getWishlistData}
      />
    );
  });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div
      className="productCategorySection_container"
      style={{ backgroundColor: bgColor || "#f4f4f4" }}
    >
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <figure>
        <img src={pattern} alt="Wing Pattern" />
      </figure>
      <div>
        <button onClick={handleNavigate}>View More &gt;</button>
      </div>
      <section>
        <div>
          <EmblaSlider
            plugins={["autoplay"]}
            slides_in_view={{ xl: 6, lg: 5, md: 4, sm: 2, xs: 2 }}
            options={{ delay: 8000, dragFree: true }}
            slides={productCards}
            no_of_slides={5}
            navigationDots={false}
          />
        </div>
      </section>
    </div>
  );
}

ProductSection.propTypes = {
  productCategorySection: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
        priceAfterDiscount: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        discountPercentage: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
      })
    ).isRequired,
  }).isRequired,
  bgColor: PropTypes.string,
};
