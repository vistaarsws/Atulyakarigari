import BanarsiSilkFilter from "./BanarsiSilkFilter";
import ProductCard from "../../components/ui/cards/productCard/ProductCard";
import { top_product_list_from_category } from "../../utils/Constant";
import BANNER_IMAGE from "../../assets/images/categoryImage.png";
import { Pagination } from "@mui/material";

import "./CategoryPage.css";
const Index = () => {
  return (
    <div className="categoryPage_container">
      <img src={BANNER_IMAGE} style={{ width: "100%" }} />
      <section>
        <div>
          <BanarsiSilkFilter />
        </div>
        <div>
          {top_product_list_from_category?.products?.map((ele) => (
            <ProductCard
              key={ele.key}
              id={ele.key}
              title={ele.title}
              picture={ele.picture}
              price={ele.price}
            />
          ))}
        </div>
      </section>
      <div className="paginationContainer">
        <Pagination count={4} />
      </div>
      {/* <div style={{ height: "20vh" }}></div> */}
    </div>
  );
};

export default Index;
