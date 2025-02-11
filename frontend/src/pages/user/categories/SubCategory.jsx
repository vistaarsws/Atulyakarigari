import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import BanarsiSilkFilter from "./BanarsiSilkFilter";
import ProductCard from "../../../components/ui/cards/product-card/ProductCard";
import { Pagination, Skeleton } from "@mui/material";
import { getSubCategoryById } from "../../../services/admin/adminAPI";
import "./CategoryPage.css";

const Index = () => {
  const { id } = useParams();
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const productsPerPage = 20;
  const hasFetched = useRef(false);

  const fetchSubCategoryData = useCallback(async () => {
    if (!id || hasFetched.current) return;
    hasFetched.current = true;

    setLoading(true);
    setError(false);

    try {
      const response = await getSubCategoryById(id);

      console.log("API Response:", response);
      setSubCategoryData(response?.data?.data || null);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setSubCategoryData(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubCategoryData();
  }, [fetchSubCategoryData]);

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
        <p>Failed to load category data. Please try again.</p>
        <button onClick={fetchSubCategoryData}>Retry</button>
      </div>
    );
  }

  const products = subCategoryData?.products || [];

  console.log("products", products);
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));
  const paginatedProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <div className="categoryPage_container">
      <section>
        <BanarsiSilkFilter />
        <div className="productList">
          {paginatedProducts.length > 0 ? (
            products.map(
              (product) => (
                console.log("pro", product),
                (
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
                )
              )
            )
          ) : (
            <div className="emptyState">No products found.</div>
          )}
        </div>
      </section>
      {totalPages > 1 && (
        <div className="paginationContainer">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
