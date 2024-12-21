// // import { IconButton } from "@mui/material";
// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import "./AdminProductCard.css";
// // import adminCardImg from "../../../../assets/images/adminProductCardImg.png";

// // const AdminProductCard = () => {
// //   return (
// //     <article className="adminProduct-container">
// //       <div className="adminProduct-details">
// //         <figure className="adminProduct-image-container">
// //           <img
// //             src={adminCardImg}
// //             alt="Banarsi Nikhar Silk Saari"
// //             className="adminProduct-image"
// //           />
// //         </figure>
// //         <h4 className="adminProduct-title">Banarsi Nikhar Silk Saari</h4>
// //       </div>
// //       <div className="adminProduct-category">
// //         <p className="adminProduct-subtitle">Banarsi Saari</p>
// //       </div>
// //       <div className="adminProduct-stock">
// //         <span className="adminProduct-stock-status">Stock</span>
// //       </div>

// //       <div className="adminProduct-price">
// //         <span className="adminProduct-discount-price">₹12,000</span>
// //         <span className="adminProduct-original-price">₹20,000</span>
// //       </div>
// //       <div className="adminProduct-date">12 Sep 2024</div>
// //       <div className="adminProduct-actions">
// //         <IconButton>
// //           <EditIcon color="primary" />
// //         </IconButton>
// //         <IconButton>
// //           <DeleteIcon color="error" />
// //         </IconButton>
// //       </div>
// //     </article>
// //   );
// // };

// // export default AdminProductCard;
// import "./AdminProductCard.css"; // Custom styles
// import React from "react";
// import { AgGridReact } from "ag-grid-react"; // Named import for AgGridReact
// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import { ModuleRegistry } from "@ag-grid-community/core";
// import "@ag-grid-community/styles/ag-grid.css";
// import "@ag-grid-community/styles/ag-theme-alpine.css";

// // Register the required module
// ModuleRegistry.registerModules([ClientSideRowModelModule]);

// const Table = () => {
//   const columnDefs = [
//     {
//       headerName: "Product & Title",
//       field: "product",
//       cellRenderer: (params) => (
//         <div className="image-cell">
//           <img src={params.data.image} alt="Product" />
//           <span>{params.value}</span>
//         </div>
//       ),
//     },
//     { headerName: "Categories", field: "category" },
//     {
//       headerName: "Stock Status",
//       field: "stockStatus",
//       cellClass: (params) =>
//         params.value === "Stock" ? "stock-cell" : "out-stock-cell",
//     },
//     {
//       headerName: "Attributes",
//       field: "attributes",
//       cellRenderer: (params) => (
//         <div>
//           <span>Color: {params.data.color}</span>
//           <br />
//           <span>Size: {params.data.size}</span>
//         </div>
//       ),
//     },
//     { headerName: "Price", field: "price" },
//     { headerName: "Date", field: "date" },
//     {
//       headerName: "Action",
//       field: "action",
//       cellRenderer: () => (
//         <div className="action-icons">
//           <i className="edit-icon">✏️</i>
//           <i className="delete-icon">🗑️</i>
//         </div>
//       ),
//     },
//   ];

//   const rowData = [
//     {
//       product: "Banarsi Nikhar Silk Saari",
//       category: "Banarsi Saari",
//       stockStatus: "Stock",
//       color: "🟡",
//       size: "5.5m",
//       price: "₹12,000 ₹20,000",
//       date: "12 Sep 2024",
//       image: "https://via.placeholder.com/54", // Replace with actual image URL
//     },
//     // Repeat for more rows...
//   ];

//   return (
//     <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
//       <AgGridReact
//         rowData={rowData}
//         columnDefs={columnDefs}
//         domLayout="autoHeight"
//         rowModelType="clientSide" // Specify row model type
//       />
//     </div>
//   );
// };

// export default Table;
import React from "react";

const AdminProductCard = () => {
  return <div>AdminProductCard AdminProductCard</div>;
};

export default AdminProductCard;
