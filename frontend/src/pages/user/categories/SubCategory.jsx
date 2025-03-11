import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubCategoryDataById } from "../../../Redux/features/CategorySlice";
import SidebarFilter from "./BanarsiSilkFilter";
import ProductCard from "../../../components/ui/cards/product-card/ProductCard";
import { Skeleton } from "@mui/material";
import "./CategoryPage.css";
import SkeletonLoader from "../../../components/ui/modal/confirmation-modal/card-skeleton/SkeletonLoader";
import "./CategoryPage.css";

const Index = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchSubCategoryDataById(id));
    }
  }, [id, dispatch]);

  const { subcategory, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (subcategory?.products) {
      setFilteredProducts(subcategory.products); // Initialize with all products
    }
  }, [subcategory]);

  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="categoryPage_container">
        <section>
          <SidebarFilter categoryData={subcategory} onFilterChange={handleFilterChange} />
          <div className="productList">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="skeletonCard">
                <Skeleton variant="rectangular" width={200} height={200} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={100} />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <SkeletonLoader />
        <SkeletonLoader />
        <button onClick={() => dispatch(fetchSubCategoryDataById(id))}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="categoryPage_container">
      <section>
        <SidebarFilter categoryData={subcategory} onFilterChange={handleFilterChange} />
        <div className="productList">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                title={product.name || "No Title"}
                picture={
                  product.images?.length ? product.images[0] : "/placeholder.png"
                }
                price={product.price || "N/A"}
                shortDescription={product.description || "No Description"}
                offer_inPercent={product.discountPercentage || null}
                priceAfterDiscount={product.priceAfterDiscount || "N/A"}
                loading={loading}
              />
            ))
          ) : (
            <div className="emptyState">No products found.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
