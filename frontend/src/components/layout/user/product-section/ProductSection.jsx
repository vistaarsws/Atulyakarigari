import { Skeleton } from "@mui/material";
import PropTypes from "prop-types";
import ProductCard from "../../../ui/cards/product-card/ProductCard";
import pattern from "../../../../assets/images/designPattern_1.svg";
import { EmblaSlider } from "../../../ui/slider/EmblaSlider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

import "./ProductSection.css";

// Utility function to handle product fallbacks
const formatProductData = (product) => ({
  id: product._id,
  title: product.name || "Unnamed Product",
  picture: product.images?.[0] || "default-image-url",
  price: product.price || 0,
  shortDescription: product.description || "No Description",
  priceAfterDiscount: product.priceAfterDiscount || 0,
  offer_inPercent: product.discountPercentage || null,
});

export default function ProductSection({ productCategorySection, bgColor }) {
  const { title, subtitle, products, subcategory_id } = productCategorySection;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  // Ensure at least 5 product cards (real or skeleton)
  const productCards = useMemo(() => {
    if (loading) {
      // Show 5 skeleton placeholders while loading
      return [...Array(5)].map((_, index) => (
        <div className="skeletonCard" key={index}>
          <div className="skeleton_rating"></div>
          <div className="skeleton_image"></div>
          <div className="skeleton_text"></div>
          <div className="skeleton_text short"></div>
          <div className="skeleton_price"></div>
          <div className="skeleton_button"></div>
        </div>
      ));
    }

    const realProducts = products.map((product) => {
      return (
        <ProductCard
          key={product._id}
          {...formatProductData(product)}
          loading={loading}
        />
      );
    });

    // Fill with skeletons if fewer than 5 real products exist
    const skeletons = [...Array(Math.max(0, 5 - realProducts.length))].map(
      (_, index) => (
        <div className="skeletonCard" key={`skeleton-${index}`}>
          <div className="skeleton_image"></div>
          <div className="skeleton_text"></div>
          <div className="skeleton_text short"></div>
        </div>
      )
    );

    return [...realProducts, ...skeletons]; // Merge real products and skeletons
  }, [products, loading]);

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/sub-categories/${subcategory_id}`);
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
