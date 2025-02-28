import { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import "./AdminProductCard.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";
import { deleteProduct } from "../../../../services/user/userAPI";
import { fetchAllCategory } from "../../../../Redux/features/CategorySlice";
import ProductDetailsPopup from "./ProductDetailsPopup";
import ConfirmationModal from "../../modal/confirmation-modal/ConfirmationModal";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminProductCard({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const dispatch = useDispatch();
  const getCategory = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedProduct(null);
  };

  const getCategoryName = useMemo(
    () => (id) => getCategory.find((cat) => cat.id === id)?.name || "Unknown",
    [getCategory]
  );

  const transformData = useMemo(
    () =>
      Array.isArray(products)
        ? products.map((product) => ({
            productImgTitle: {
              prodImg: product.images?.[0] || "default-image-path.jpg",
              prodName: product.name,
            },
            category: getCategoryName(product.category),
            stock: product.stock,
            productID: product._id,
            sku: product.sku,
            price: product.price,
            date: new Date(product.updatedAt).toLocaleDateString(),
            name: product.name,
            fullProduct: product,
          }))
        : [],
    [products, getCategoryName]
  );

  const profileImageRenderer = (params) => {
    const { prodImg, prodName } = params.value;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={prodImg} alt={prodName} style={{ width: "35px", height: "35px", borderRadius: "5px", objectFit: "cover" }} />
        <span style={{ marginLeft: "1rem" }}>{prodName}</span>
      </div>
    );
  };

  const priceRenderer = (params) => {
    const originalPrice = params.data.price;
    const discount = params.data.fullProduct.discountPercentage;
    const effectivePrice = originalPrice - (originalPrice * discount) / 100;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span style={{ fontWeight: 700, fontSize: "14px", color: "#000" }}>
          ₹{effectivePrice.toFixed(0)}{" "}
          <span style={{ textDecoration: "line-through", fontSize: "14px", color: "#9F9F9F", fontWeight: 400 }}>
            ₹{originalPrice.toFixed(0)}
          </span>
        </span>
      </div>
    );
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenDetails(true);
  };

  const deleteProductHandler = (params) => {
    setProductToDelete(params.data.fullProduct);
    setOpenConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!productToDelete) return;

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

  const actionCellRenderer = (params) => (
    <div>
      <IconButton onClick={() => handleViewDetails(params.data.fullProduct)} aria-label="edit">
        <EditIcon sx={{ fill: "#3F51B5" }} />
      </IconButton>
      <IconButton onClick={() => deleteProductHandler(params)} aria-label="delete" disabled={loading}>
        <DeleteIcon sx={{ fill: "#AD3F38" }} />
      </IconButton>
    </div>
  );

  const [colDefs] = useState([
    { field: "productImgTitle", headerName: "PRODUCT IMAGE & TITLE", cellRenderer: profileImageRenderer, flex: 1, cellStyle: { fontWeight: "bold" } },
    { field: "category", headerName: "CATEGORIES", flex: 0.6 },
    { field: "productID", headerName: "PRODUCT ID", flex: 0.8 },
    { field: "sku", headerName: "SKU ID", flex: 0.7 },
    { field: "price", headerName: "PRICE", cellRenderer: priceRenderer, flex: 0.7 },
    { field: "date", headerName: "DATE", flex: 0.4 },
    { field: "stock", headerName: "STOCK", flex: 0.3 },
    { headerName: "ACTION", cellRenderer: actionCellRenderer, sortable: false, filter: true, flex: 0.3 },
  ]);

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <AgGridReact rowData={transformData} columnDefs={colDefs} domLayout="autoHeight" />
      
      <ProductDetailsPopup open={openDetails} handleClose={handleCloseDetails} product={selectedProduct} />

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
