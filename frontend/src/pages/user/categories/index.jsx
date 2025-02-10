import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BanarsiSilkFilter from "./BanarsiSilkFilter";
import ProductCard from "../../../components/ui/cards/product-card/ProductCard";
// import { Pagination } from "@mui/material";
import { getcategoryById } from "../../../../src/services/user/userAPI";
import "./CategoryPage.css";

const Index = () => {
  const { id } = useParams(); // Get the category ID from the route params
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Invalid category ID");
      return;
    }

    const fetchCategoryData = async () => {
      try {
        const response = await getcategoryById(id); // Pass the ID to the API call
        if (response?.data?.data) {
          setCategoryData(response?.data?.data);
        } else {
          console.error("API response does not contain data:", response);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!categoryData) {
    return <div className="error">Failed to load category data.</div>;
  }

  const products = categoryData.products || []; // Ensure products is an array

  // const totalPages = Math.ceil(products.length / 10);

  return (
    <div className="categoryPage_container">
      {/* <img src={BANNER_IMAGE} style={{ width: "100%" }} /> */}
      {/* <div className="categoryHeader"></div> */}
      <section>
        <div>
          <BanarsiSilkFilter />
        </div>
        <div className="productList">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product?._id}
                id={product?._id}
                title={product?.name || "No Title"}
                picture={product?.images[0] || ""}
                price={product?.price || "N/A"}
                shortDescription={product?.description || "No Description"}
                offer_inPercent={product?.discountPercentage || null}
                priceAfterDiscount={product?.priceAfterDiscount || "N/A"}
                loading={loading}
              />
            ))
          ) : (
            <div>No products available.</div>
          )}
        </div>
      </section>
      {/* <div className="paginationContainer">
        <Pagination count={totalPages} />
      </div> */}
    </div>
  );
};

export default Index;
