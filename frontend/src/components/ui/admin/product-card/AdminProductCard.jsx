import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { getProducts } from "../../../../services/user/userAPI";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminProductCard() {
  const transformData = products.map((product) => ({
    profileImg: product.images[0], // Assuming the first image is used
    category: product.category,
    stock: product.stock,
    price: product.priceAfterDiscount || product.price, // Use discounted price if available
    date: new Date(product.updatedAt).toLocaleDateString(), // Format the date
    name: product.name, // Add the name for the product title
  }));

  console.log(transformData, "transsssssss");

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
      // Implement edit functionality here
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
    <div style={{ width: "100%", height: "auto", padding: "1rem" }}>
      <AgGridReact
        rowData={transformData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
      />
    </div>
  );
}
