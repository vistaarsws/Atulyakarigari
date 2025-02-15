import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import "./AdminProductCard.css";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ProductForm from "../../../../components/layout/admin/product-form/ProductForm";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";

import { deleteProduct } from "../../../../services/user/userAPI";
import { fetchAllCategory } from "../../../../Redux/features/CategorySlice";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminProductCard({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    dispatch(fetchAllProducts());
  };
  const getCategory = useSelector((state) => state.categories.categories);

  const getCategoryName = (id) => {
    return getCategory.find((cat) => cat.id == id);
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategory());
  }, [dispatch]);

  const priceRenderer = (params) => {
    const originalPrice = params.data.price;
    const discount = params.data.fullProduct.discountPercentage;
    const effectivePrice = originalPrice - (originalPrice * discount) / 100;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Display the discounted price (current price) */}
        <span style={{ fontWeight: 700, fontSize: "14px", color: "#000" }}>
          ₹{effectivePrice.toFixed(0)}
          {"  "}
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

        {/* Display the original price as strikethrough */}
      </div>
    );
  };

  const transformData = products.map((product) => ({
    productImgTitle: {
      prodImg: product.images?.[0] || "default-image-path.jpg", // Fallback for missing images
      prodName: product.name,
    },
    category: getCategoryName(product.category)?.name,
    stock: product.stock,
    productID: product._id,
    sku: product.sku,
    // attributes: product.attributes.map((obj) => obj.key),
    price: product.price,
    date: new Date(product.updatedAt).toLocaleDateString(), // Format the date
    name: product.name,
    fullProduct: product,
  }));

  // Custom Cell Renderer for Profile Image
  const profileImageRenderer = (params) => {
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

  // Custom Cell Renderer for Action Icons
  const actionCellRenderer = (params) => {
    const handleEdit = () => {
      setSelectedProduct(params.data.fullProduct);
      setOpen(true);
    };

    const deleteProductHandler = async () => {
      try {
        await deleteProduct(params.data.fullProduct._id);
        dispatch(fetchAllProducts());
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div>
        <IconButton onClick={handleEdit} aria-label="edit">
          <EditIcon sx={{ fill: "#383737" }} />
        </IconButton>
        <IconButton onClick={deleteProductHandler} aria-label="delete">
          <DeleteIcon sx={{ fill: "#AD3F38" }} />
        </IconButton>
      </div>
    );
  };

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    {
      field: "productImgTitle",
      headerName: "PRODUCT IMAGE & TITLE",
      cellRenderer: profileImageRenderer,
      flex: 1,
      cellStyle: { fontWeight: "bold" },
    },

    { field: "category", headerName: "CATEGORIES", flex: 0.7 },
    { field: "stock", headerName: "STOCK STATUS", flex: 0.5},
    { field: "productID", headerName: "PRODUCT ID", flex: 0.8 },
    { field: "sku", headerName: "SKU ID", flex: 0.7 },
    {
      field: "price",
      headerName: "PRICE",
      cellRenderer: priceRenderer,
      flex: 0.7,
    },
    { field: "date", headerName: "DATE", flex: 0.5 },
    {
      headerName: "ACTION",
      cellRenderer: actionCellRenderer,
      sortable: false,
      filter: true,
      flex: 0.5,
    },
  ]);

  const defaultColDef = {
    flex: 1,
  };

  // Container: Defines the grid's theme & dimensions.
  return (
    <div
      style={{
        width: "100%",

        padding: "1rem",
      }}
    >
      <AgGridReact
        rowData={transformData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
      />
      {/* ----------------------------------------------------------DIALOG EDIT PRODUCT--------------------------------------------------------------- */}
      <Box>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              // Form data handling logic
              handleClose();
            },
          }}
        >
          <DialogContent>
            <ProductForm
              productDetails={selectedProduct}
              isProductEditing={true}
              closeDialog={handleClose}
            />
          </DialogContent>
          <DialogActions sx={{ padding: "0 2.4rem 2rem" }}>
            {/* <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button> */}
            {/* <Button type="submit" variant="contained">
              Submit
            </Button> */}
          </DialogActions>
        </Dialog>
      </Box>
      {/* -------------------------------------------------------------------------------------------------------------------------------------------------- */}
    </div>
  );
}
