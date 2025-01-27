import PropTypes from "prop-types";
import ProductCard from "../../../ui/cards/product-card/ProductCard";
import pattern from "../../../../assets/images/designPattern_1.svg";
import { EmblaSlider } from "../../../ui/slider/EmblaSlider";

import "./ProductSection.css";

// Utility function to handle product fallbacks
const formatProductData = (product) => ({
  id: product._id,
  title: product.name || "Unnamed Product",
  picture: product.images?.[0] || "default-image-url", // Fallback for image
  price: product.price || "N/A",
  shortDescription: product.description || "No Description",
  priceAfterDiscount: product.priceAfterDiscount || "N/A",
  offer_inPercent: product.discountPercentage || "N/A",
});

export default function ProductSection({ productCategorySection, bgColor }) {
  const { title, subtitle, products } = productCategorySection;

  const productCards = products.map((product, index) => (
    <ProductCard key={index} {...formatProductData(product)} />
  ));

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
        <button>View More &gt;</button>
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
