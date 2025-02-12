import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BanarsiSilkFilter from "./BanarsiSilkFilter";
import ProductCard from "../../../components/ui/cards/product-card/ProductCard";
import { Skeleton } from "@mui/material";
import "./CategoryPage.css";
import { useDispatch } from "react-redux";
import { fetchSubCategoryDataById } from "../../../Redux/features/CategorySlice";
import SkeletonLoader from "../../../components/ui/modal/confirmation-modal/card-skeleton/SkeletonLoader";

const Index = () => {
  const { id } = useParams();
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const fetchSubCategoryHandler = async () => {
    setLoading(true);
    setError(false);

    try {
      const fetchedData = await dispatch(fetchSubCategoryDataById(id)).unwrap();

      console.log("API Response:", fetchedData.products);
      setSubCategoryData(fetchedData);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setSubCategoryData(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategoryHandler();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="categoryPage_container">
        <section>
          <BanarsiSilkFilter />
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
        <p>Failed to load category data. Please try again.</p>
        <button onClick={fetchSubCategoryHandler}>Retry</button>
      </div>
    );
  }

  const products = subCategoryData?.products || [];

  return (
    <div className="categoryPage_container">
      <section>
        <BanarsiSilkFilter />
        <div
          className={`productList  ${products.length > 3 ? "responsiveLayout" : ""}`}
          style={{
            justifyContent: products.length > 3 ? "space-between" : "start",
          }}
        >
          {products?.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product?._id}
                id={product?._id}
                title={product?.name || "No Title"}
                picture={product?.images?.[0] || "/placeholder.png"}
                price={product?.price || "N/A"}
                shortDescription={product?.description || "No Description"}
                offer_inPercent={product?.discountPercentage || null}
                priceAfterDiscount={product?.priceAfterDiscount || "N/A"}
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
