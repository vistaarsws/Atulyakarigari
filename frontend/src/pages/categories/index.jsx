import React from "react";
import BanarsiSilkFilter from "./BanarsiSilkFilter ";
import ProductCard from "../../components/ui/cards/productCard/ProductCard";
import { top_product_list_from_category } from "../../utils/Constant";
import BANNER_IMAGE from "../../assets/images/categoryImage.png";

const Index = () => {
  return (
    <>
      <img src={BANNER_IMAGE} style={{ width: "100%" }} />
      <div style={{ marginTop: "4rem", display: "flex", width: "100%" }}>
        <div
          style={{
            height: "89vh",
            overflow: "scroll",
            scrollbarWidth: "none",
            width: "20vw",
            minWidth: "250px",
          }}
        >
          <BanarsiSilkFilter />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            // gap: "30px",
            height: "89vh",
            overflow: "scroll",
            scrollbarWidth: "none",
          }}
        >
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
      </div>
    </>
  );
};

export default Index;
