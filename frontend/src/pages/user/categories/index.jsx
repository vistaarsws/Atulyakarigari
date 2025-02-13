import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BanarsiSilkFilter from "./BanarsiSilkFilter";
import ProductCard from "../../../components/ui/cards/product-card/ProductCard";
import { getcategoryById } from "../../../../src/services/user/userAPI";
import "./CategoryPage.css";
import SkeletonLoader from "../../../components/ui/modal/confirmation-modal/card-skeleton/SkeletonLoader";

const Index = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Invalid category ID");
      return;
    }

    const fetchCategoryData = async () => {
      try {
        const response = await getcategoryById(id);
        if (response?.data?.data) {
          setCategoryData(response.data.data);
          setFilteredProducts(response.data.data.products || []);
        } else {
          console.error("API response does not contain data:");
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleFilterChange = (newFilteredProducts) => {
    setFilteredProducts(newFilteredProducts);
  };

  if (loading) {
    return <div className="loading"><SkeletonLoader/></div>;
  }

  if (!categoryData) {
    return <div className="error"><SkeletonLoader/><SkeletonLoader/></div>;
  }

  return (
    <div className="categoryPage_container">
      <section>
        <div>
          <BanarsiSilkFilter 
            categoryData={categoryData}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="productList">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
            <div>No products found matching the selected filters.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;