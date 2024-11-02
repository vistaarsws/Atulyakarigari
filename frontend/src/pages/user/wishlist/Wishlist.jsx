import React from "react";
import ProductCard from "../../../components/ui/cards/productCard/ProductCard";
import { top_product_list_from_category } from "../../../utils/Constant";
import "./Wishlist.css";

const Wishlist = () => {
  console.log(top_product_list_from_category.products[0]);

  return (
    <div className="wishlist_container">
      {top_product_list_from_category.products.map((ele) => (
        <ProductCard
          key={ele.key}
          id={ele.key}
          title={ele.title}
          picture={ele.picture}
          price={ele.price}
          isAddedToWislist={true}
        />
      ))}
    </div>
  );
};

export default Wishlist;
