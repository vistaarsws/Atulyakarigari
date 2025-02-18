import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import "./AdminProductCard.css";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import ProductForm from "../../../../components/layout/admin/product-form/ProductForm";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";

import { deleteProduct, getQuestionsByProduct, getReviewById } from "../../../../services/user/userAPI";
import { fetchAllCategory } from "../../../../Redux/features/CategorySlice";
import ProductDetailsPopup from "./ProductDetailsPopup.jsx"; // Import the new popup component

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminProductCard({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const dispatch = useDispatch();

  // Close Edit Dialog
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedProduct(null);
    dispatch(fetchAllProducts());
  };

  // Close View Details Dialog
  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedProduct(null);
  };

  const getCategory = useSelector((state) => state.categories.categories);

  const getCategoryName = (id) => {
    return getCategory.find((cat) => cat.id === id)?.name || "Unknown";
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  // Price Renderer Function
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

  // Ensure products is an array before mapping
  const transformData = Array.isArray(products)
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
    : [];

  // Image & Name Renderer
  const profileImageRenderer = (params) => {
    const { prodImg, prodName } = params.value;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={prodImg}
          alt={prodName}
          style={{ width: "35px", height: "35px", borderRadius: "5px", objectFit: "cover" }}
        />
        <span style={{ marginLeft: "1rem" }}>{prodName}</span>
      </div>
    );
  };

  // Handle View Details with API Calls
  const handleViewDetails = async (product) => {
    setSelectedProduct(product);
    setOpenDetails(true);

    try {
      const [reviewsResponse, qnaResponse] = await Promise.all([
        getReviewById(product._id), // Fetch reviews
        getQuestionsByProduct(product._id), // Fetch Q&A
      ]);

      setSelectedProduct((prev) => ({
        ...prev,
        reviews: reviewsResponse?.data?.data?.reviews || [],
        averageRating: reviewsResponse?.data?.data?.averageRating || "0",
        questions: qnaResponse?.data?.questions || [],
      }));
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  // Action Buttons Renderer
  const actionCellRenderer = (params) => {
    const handleEdit = () => {
      setSelectedProduct(params.data.fullProduct);
      setOpenEdit(true);
    };

    const deleteProductHandler = async () => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        try {
          await deleteProduct(params.data.fullProduct._id);
          dispatch(fetchAllProducts());
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    };

    return (
      <div>
        <IconButton onClick={() => handleViewDetails(params.data.fullProduct)} aria-label="view">
          <VisibilityIcon sx={{ fill: "#3F51B5" }} />
        </IconButton>
        <IconButton onClick={handleEdit} aria-label="edit">
          <EditIcon sx={{ fill: "#383737" }} />
        </IconButton>
        <IconButton onClick={deleteProductHandler} aria-label="delete">
          <DeleteIcon sx={{ fill: "#AD3F38" }} />
        </IconButton>
      </div>
    );
  };

  // Column Definitions
  const [colDefs] = useState([
    {
      field: "productImgTitle",
      headerName: "PRODUCT IMAGE & TITLE",
      cellRenderer: profileImageRenderer,
      flex: 1,
      cellStyle: { fontWeight: "bold" },
    },
    { field: "category", headerName: "CATEGORIES", flex: 0.7 },
    { field: "stock", headerName: "STOCK STATUS", flex: 0.5 },
    { field: "productID", headerName: "PRODUCT ID", flex: 0.8 },
    { field: "sku", headerName: "SKU ID", flex: 0.7 },
    { field: "price", headerName: "PRICE", cellRenderer: priceRenderer, flex: 0.7 },
    { field: "date", headerName: "DATE", flex: 0.5 },
    { headerName: "ACTION", cellRenderer: actionCellRenderer, sortable: false, filter: true, flex: 0.7 },
  ]);

  const defaultColDef = { flex: 1 };

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <AgGridReact rowData={transformData} columnDefs={colDefs} defaultColDef={defaultColDef} domLayout="autoHeight" />

      {/* EDIT PRODUCT DIALOG */}
      <Box>
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogContent>
            <ProductForm productDetails={selectedProduct} isProductEditing={true} closeDialog={handleCloseEdit} />
          </DialogContent>
        </Dialog>
      </Box>

      {/* VIEW PRODUCT DETAILS DIALOG */}
      <ProductDetailsPopup open={openDetails} handleClose={handleCloseDetails} product={selectedProduct} />
    </div>
  );
}
