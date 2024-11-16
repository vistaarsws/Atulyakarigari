import ProductCard from "../../ui/cards/productCard/ProductCard";
import pattern from "../../../assets/images/designPattern_1.svg";
import { EmblaSlider } from "../../ui/slider/EmblaSlider";
import { top_product_list_from_category } from "../../../utils/Constant";

import "./ProductSection.css";
import PropTypes from "prop-types";

export default function ProductSection({
  productCategorySection = top_product_list_from_category,
  bgColor,
}) {
  const productCategorySection_products = productCategorySection.products.map(
    (product, index) => {
      return (
        <ProductCard
          key={index}
          id={product.title + index}
          title={product.title}
          picture={product.picture}
          price={product.price}
        />
      );
    }
  );
  return (
    <div
      className="productCategorySection_container"
      style={{ backgroundColor: bgColor ? bgColor : "#f4f4f4" }}
    >
      <h1>{productCategorySection.title}</h1>
      <h2>{productCategorySection.subtitle}</h2>
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
            slides={productCategorySection_products}
            no_of_slides={5}
            navigationDots={false}
          />
        </div>
      </section>
    </div>
  );
}

ProductSection.propTypes = {
  productCategorySection: PropTypes.object,
};
