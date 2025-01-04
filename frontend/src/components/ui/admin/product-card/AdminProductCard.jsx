import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import "./AdminProductCard.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCategory } from "../../../../Redux/features/CategorySlice";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import ProductForm from "../../../../components/layout/admin/product-form/ProductForm";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminProductCard({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const getCategory = useSelector((state) => state.categories.categories);

  const getCategoryName = (id) => {
    return getCategory.find((cat) => cat.id == id);
  };

  useEffect(() => {
    if (!getCategory || getCategory.length === 0) {
      dispatch(fetchAllCategory());
    }
  }, [dispatch, getCategory]);

  console.log("Categories:", getCategory);

  const transformData = products.map((product) => ({
    profileImg: product.images[0], // Assuming the first image is used
    category: getCategoryName(product.category)?.name,
    stock: product.stock,
    price: product.priceAfterDiscount || product.price, // Use discounted price if available
    date: new Date(product.updatedAt).toLocaleDateString(), // Format the date
    name: product.name,
    fullProduct: product,
  }));

  // Custom Cell Renderer for Profile Image
  const profileImageRenderer = (params) => {
    return (
      <div>
        <figure>
          <img
            src={params.value}
            alt="Profile"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
        </figure>
        {/* <p>Banarasi Saree</p> */}
      </div>
    );
  };

  // Custom Cell Renderer for Action Icons
  const actionCellRenderer = (params) => {
    const handleEdit = () => {
      setSelectedProduct(params.data.fullProduct);
      setOpen(true);

      console.log("Edit action on row:", params.data);
    };

    const handleDelete = () => {
      // Implement delete functionality here
      console.log("Delete action on row:", params.data);
    };

    return (
      <div>
        <IconButton onClick={handleEdit} aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </div>
    );
  };

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState([
    {
      field: "profileImg",
      headerName: "PRODUCT & TITLE",
      cellRenderer: profileImageRenderer,
      flex: 1,
    },
    { field: "category", headerName: "CATEGORIES", flex: 1 },
    { field: "stock", headerName: "STOCK STATUS", flex: 1 },
    { field: "price", headerName: "PRICE", flex: 1 },
    { field: "date", headerName: "DATE", flex: 1 },
    {
      headerName: "ACTION",
      cellRenderer: actionCellRenderer,
      sortable: false,
      filter: true,
      flex: 1,
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
            />
          </DialogContent>
          <DialogActions sx={{ padding: "0 2.4rem 2rem" }}>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* -------------------------------------------------------------------------------------------------------------------------------------------------- */}
    </div>
  );
}
