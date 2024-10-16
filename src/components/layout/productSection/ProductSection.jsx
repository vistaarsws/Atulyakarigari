import ProductCard from "../../ui/cards/productCard/ProductCard";
import pattern from "../../../assets/images/wingPattern.svg";
import { EmblaSlider } from "../../ui/slider/EmblaSlider";
import { top_product_list_from_category } from "../../../utils/Constant";

import "./ProductSection.css";
import PropTypes from "prop-types";

export default function ProductSection({
  productCategorySection = top_product_list_from_category,
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
    <div className="productCategorySection_container">
      <h1>{productCategorySection.title}</h1>
      <h2>{productCategorySection.subtitle}</h2>
      <figure>
        <img src={pattern} alt="Wing Pattern" />
      </figure>
      <section>
        <div>
          <button>View More &gt;</button>
        </div>
        <div>
          <EmblaSlider
            plugins={["autoplay"]}
            slides_in_view={{ xl: 5, lg: 4, md: 3, sm: 2, xs: 2 }}
            options={{ delay: 2000, dragFree: true }}
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
