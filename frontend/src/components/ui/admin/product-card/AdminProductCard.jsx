import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Zoom from "@mui/material/Zoom";
import "./AdminProductCard.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";
import { deleteProduct } from "../../../../services/user/userAPI";
import { fetchAllCategory } from "../../../../Redux/features/CategorySlice";
import ProductDetailsPopup from "./ProductDetailsPopup";
import ConfirmationModal from "../../modal/confirmation-modal/ConfirmationModal";

// Add these styles to your AdminProductCard.css
const cardStyles = `
.search-results-container {
  display: flex;
  align-items: center;
  // justify-content: center;
  margin-bottom: 16px;
  animation: slideIn 0.3s ease;
}

.search-results-count {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f0f4f8;
  border-radius: 8px;
  font-size: 1.2rem;
  color: #3F51B5;
  margin-right: 12px;
}

.search-results-count .search-icon {
  margin-right: 6px;
  font-size: 1.5rem;
  color: #3F51B5;
}

.search-chip {
  background-color: #e3f2fd;
  color: #1565c0;
  border-radius: 16px;
  font-size: 0.8rem;
  margin-right: 8px;
  transition: all 0.2s ease;
  animation: fadeIn 0.5s ease;
}

.search-chip:hover {
  background-color: #bbdefb;
}

.no-results-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #666;
  font-size: 1.5rem;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.no-results-message .search-icon {
  margin-right: 8px;
  color: #9e9e9e;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ag-row:hover {
  background-color: #f5f5f5 !important;
  transition: background-color 0.2s ease;
}

.ag-header-cell {
  font-weight: 600;
  color: #424242;
}

.ag-row-odd {
  background-color: #fafafa;
}

.ag-row-even {
  background-color: #ffffff;
}
`;

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminProductCard({ productStatus, searchQuery = "" }) {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [gridApi, setGridApi] = useState(null);

  // Add this to inject the CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = cardStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getCategory = useSelector((state) => state.categories.categories);
  const allProducts = useSelector((state) => state?.products?.products || []);

  // Filter products based on status and search query
  const products = useMemo(() => {
    return (
      allProducts?.filter((prod) => {
        if (!prod) return false;

        // Status filter
        const statusMatch =
          productStatus === "all"
            ? true
            : productStatus === "outofstock"
              ? prod.stock === 0
              : prod.status && prod.status.toLowerCase() === productStatus;

        // If no search query, just apply status filter
        if (!searchQuery || searchQuery.trim() === "") return statusMatch;

        // Apply search filter - with null checks
        const query = searchQuery.toLowerCase();
        return (
          statusMatch &&
          ((prod.name && prod.name.toLowerCase().includes(query)) ||
            (prod.sku && prod.sku.toLowerCase().includes(query)) ||
            (prod._id && prod._id.toLowerCase().includes(query)) ||
            (prod.price !== undefined && String(prod.price).includes(query)))
        );
      }) || []
    );
  }, [allProducts, productStatus, searchQuery]);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  // Apply external filter when search query changes
  useEffect(() => {
    if (gridApi) {
      gridApi.onFilterChanged();
    }
  }, [searchQuery, gridApi]);

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedProduct(null);
  };

  const getCategoryName = useMemo(
    () => (id) =>
      getCategory?.find((cat) => cat && cat._id === id)?.name || "Unknown",
    [getCategory]
  );

  const transformData = useMemo(
    () =>
      Array.isArray(products)
        ? products
            .map((product) => {
              if (!product) return null;
              return {
                productImgTitle: {
                  prodImg: product.images?.[0] || "default-image-path.jpg",
                  prodName: product.name || "Unnamed Product",
                },
                category: getCategoryName(product?.category),
                stock: product.stock || 0,
                productID: product?._id || "No ID",
                sku: product.sku || "No SKU",
                price: product.price || 0,
                date: product.updatedAt
                  ? new Date(product.updatedAt).toLocaleDateString()
                  : "No date",
                name: product.name || "Unnamed Product",
                fullProduct: product,
              };
            })
            .filter(Boolean)
        : [],
    [products, getCategoryName]
  );

  const profileImageRenderer = (params) => {
    if (!params.value) return <div>No Image</div>;

    const { prodImg, prodName } = params.value;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={prodImg}
          alt={prodName}
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "5px",
            objectFit: "cover",
          }}
        />
        <span style={{ marginLeft: "1rem" }}>{prodName}</span>
      </div>
    );
  };

  const priceRenderer = (params) => {
    if (!params.data) return <div>No Data</div>;

    const originalPrice = params.data.price || 0;
    const discount = params.data.fullProduct?.discountPercentage || 0;
    const effectivePrice = originalPrice - (originalPrice * discount) / 100;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "14px", color: "#000" }}>
          ₹{effectivePrice.toFixed(0)}{" "}
          <span
            style={{
              textDecoration: "line-through",
              fontSize: "14px",
              color: "#9F9F9F",
              fontWeight: 400,
            }}
          >
            ₹{originalPrice.toFixed(0)}
          </span>
        </span>
      </div>
    );
  };

  const handleViewDetails = (product) => {
    if (!product) return;
    setSelectedProduct(product?._id);
    setOpenDetails(true);
  };

  const deleteProductHandler = (params) => {
    if (!params.data?.fullProduct) return;
    setProductToDelete(params.data.fullProduct);
    setOpenConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete?._id) return;

    setLoading(true);
    try {
      await deleteProduct(productToDelete._id);
      dispatch(fetchAllProducts());
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
      setOpenConfirm(false);
      setProductToDelete(null);
    }
  };

  const actionCellRenderer = (params) => {
    if (!params.data?.fullProduct) return <div>No Actions</div>;

    return (
      <div>
        <IconButton
          onClick={() => handleViewDetails(params.data.fullProduct)}
          aria-label="edit"
        >
          <EditIcon sx={{ fill: "#3F51B5" }} />
        </IconButton>
        <IconButton
          onClick={() => deleteProductHandler(params)}
          aria-label="delete"
          disabled={loading}
        >
          <DeleteIcon sx={{ fill: "#AD3F38" }} />
        </IconButton>
      </div>
    );
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const [colDefs] = useState([
    {
      field: "productImgTitle",
      headerName: "PRODUCT IMAGE & TITLE",
      cellRenderer: profileImageRenderer,
      flex: 1,
      cellStyle: { fontWeight: "bold" },
    },
    { field: "category", headerName: "CATEGORIES", flex: 0.6 },
    { field: "productID", headerName: "PRODUCT ID", flex: 0.8 },
    { field: "sku", headerName: "SKU ID", flex: 0.7 },
    {
      field: "price",
      headerName: "PRICE",
      cellRenderer: priceRenderer,
      flex: 0.7,
    },
    { field: "date", headerName: "DATE", flex: 0.4 },
    { field: "stock", headerName: "STOCK", flex: 0.3 },
    {
      headerName: "ACTION",
      cellRenderer: actionCellRenderer,
      sortable: false,
      filter: true,
      flex: 0.3,
    },
  ]);

  // Search status info display
  const renderSearchInfo = () => {
    if (!searchQuery) return null;

    if (products.length === 0) {
      return (
        <Zoom in={true}>
          <div className="no-results-message">
            <SearchIcon className="search-icon" />
            {`No products found matching ${searchQuery}`}
          </div>
        </Zoom>
      );
    }

    return (
      <div className="search-results-container">
        <div className="search-results-count">
          <SearchIcon className="search-icon" />
          Found {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      {renderSearchInfo()}

      {products.length > 0 ? (
        <AgGridReact
          rowData={transformData}
          columnDefs={colDefs}
          domLayout="autoHeight"
          onGridReady={onGridReady}
          animateRows={true}
          rowClass="ag-row-animation"
          headerHeight={48}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      ) : (
        searchQuery && <div></div> // Empty div to avoid showing the empty grid when no results
      )}

      <ProductDetailsPopup
        open={openDetails}
        handleClose={handleCloseDetails}
        productId={selectedProduct}
      />

      {/* Confirmation Modal for Deleting a Product */}
      <ConfirmationModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
}
