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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const fetchSubCategoryHandler = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getSubCategoryById(id);
      const products = response?.data?.data?.products || [];
      setSubCategoryData(response?.data?.data || null);
      setFilteredProducts(products);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setSubCategoryData(null);
      setFilteredProducts([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategoryData();
  }, [fetchSubCategoryData]);

  const handleFilterChange = (newFilteredProducts) => {
    setFilteredProducts(newFilteredProducts);
    setPage(1); // Reset pagination on filter change
  };

  if (loading) {
    return (
      <div className="categoryPage_container">
        <section>
          <BanarsiSilkFilter onFilterChange={handleFilterChange} />
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
        <button onClick={fetchSubCategoryData}>Retry</button>
      </div>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productsPerPage)
  );
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <div className="categoryPage_container">
      <section>
        <BanarsiSilkFilter
          categoryData={subCategoryData}
          onFilterChange={handleFilterChange}
        />
        <div className="productList">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard
                key={product?._id}
                id={product?._id}
                title={product?.name || "No Title"}
                picture={
                  product?.images?.length
                    ? product.images[0]
                    : "/placeholder.png"
                }
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
