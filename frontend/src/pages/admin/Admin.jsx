import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Avatar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

import SidebarDraft from "../../components/layout/admin/draftSection/draftSection";

import { Menu as MenuIcon, Add as AddIcon, Style } from "@mui/icons-material";

import {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByCategoryId,
} from "../../services/admin/adminAPI";

import { createProduct, getProducts } from "../../services/user/userAPI";

import notificationIcon from "../../assets/images/notificationIcon.svg";
import adminLogoutIcon from "../../assets/images/adminLogoutIcon.svg";

import "./Admin.css";

export default function Admin() {
  const [open, setOpen] = useState(false);

  const [loadingStates, setLoadingStates] = useState({
    category: false,
    subcategory: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [variantOption, setVariantOption] = useState("");
  const [variantValues, setVariantValues] = useState([]);
  const [currentVariantValue, setCurrentVariantValue] = useState("");
  const [savedVariants, setSavedVariants] = useState([]);
  const [variantToEdit, setVariantToEdit] = useState(null);

  const [categoryName, setCategoryName] = useState("");
  const [addCategoryPopup, setAddCategoryPopup] = useState(false);
  const [viewCategoriesPopup, setViewCategoriesPopup] = useState(false);
  const [categories, setCategories] = useState([]);

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const [editSubCategoryId, setEditSubCategoryId] = useState(null);
  const [editSubCategoryName, setEditSubCategoryName] = useState("");

  const [subCategoryName, setSubCategoryName] = useState("");
  const [viewSubCategoriesPopup, setViewSubCategoriesPopup] = useState(false);
  const [addSubCategoryPopup, setAddSubCategoryPopup] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  const [parentCategory, setParentCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    productImage: [],
    description: "",
    price: "",
    category: null,
    subCategory: "",
    _attributes: [],
    stock: 1,
    status: "",
    discountPercentage: "",
    artisanName: "",
    artisanAbout: "",
    artisanImage: null,
  });

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleOpenDialog = (variant = null) => {
    if (variant) {
      // Editing mode: Populate fields with variant data
      setVariantOption(variant.key);
      setVariantValues(variant.value);
      setIsEditing(true);
      setVariantToEdit(variant.key);
    } else {
      // Adding mode: Reset fields
      setVariantOption("");
      setVariantValues([]);
      setIsEditing(false);
      setVariantToEdit(null);
    }
    setIsVariantDialogOpen(true);
  };

  const handleCloseDialog = () => {
    // Reset all states and close dialog
    setVariantOption("");
    setVariantValues([]);
    setCurrentVariantValue("");
    setIsEditing(false);
    setVariantToEdit(null);
    setIsVariantDialogOpen(false);
  };

  // Add a new value to the variants
  const handleAddValue = () => {
    const trimmedValue = currentVariantValue.trim();

    if (trimmedValue && !variantValues?.includes(trimmedValue)) {
      setVariantValues((prevVariantValues) => {
        if (Array.isArray(prevVariantValues)) {
          return [...prevVariantValues, trimmedValue]; // Spread the previous array if it's valid
        }
        return [trimmedValue]; // Fallback to an array containing the new value if prevVariantValues is not iterable
      });
      setCurrentVariantValue("");
    }
  };

  // Remove a value from the variants
  const handleDeleteValue = (valueToDelete) => {
    setVariantValues(variantValues?.filter((value) => value !== valueToDelete));
  };

  // Handle saving the variant
  const handleSave = () => {
    if (isEditing && variantToEdit) {
      // Update variant
      setSavedVariants((prev) =>
        prev.map((variant) =>
          variant.key === variantToEdit
            ? { ...variant, key: variantOption, value: variantValues }
            : variant
        )
      );
    } else {
      // Add new variant
      console.log(variantOption, variantValues, "rishit");

      setSavedVariants((prev) => [
        ...prev,
        { key: variantOption, value: variantValues },
      ]);
    }
    // debugger;

    handleCloseDialog();
  };

  // Handle deleting a saved variant
  const handleDeleteSavedVariant = (optionToDelete) => {
    setSavedVariants(
      savedVariants.filter((variant) => variant.key !== optionToDelete)
    );
  };

  // --------------------------------------------------------------------------------------------------------

  const getCategoryBySubcategoryId = (subcategoryId) => {
    for (const category of categories) {
      if (category.subcategory.includes(subcategoryId)) {
        return category._id; // Return the category ID
      }
    }
    return null;
  };

  // ----------------------------------------------Function for deleting category and subcategory-----------------------------

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      await getCategoryData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      const catId = getCategoryBySubcategoryId(id);
      await deleteSubCategory(id);
      await getSubCategoryData(catId);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  // --------------------------------------------Function for Adding category and subcategory------------------------------------

  const handleAddCategory = async () => {
    try {
      setAddCategoryPopup(false);
      await createCategory(categoryName);
      await getCategoryData();
      setCategoryName("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddSubCategory = async () => {
    try {
      const parentCatId = parentCategory._id;
      await createSubCategory(subCategoryName, parentCatId);
      await getSubCategoryData(parentCatId);
      setAddSubCategoryPopup(false);
      setSubCategoryName("");
      setParentCategory("");
      console.log("addSUbCateggg", res);
    } catch (error) {
      console.log(error);
    }
  };

  // ----------------------------------------Function for Geting categories and subcategories--------------------------------------

  const getCategoryData = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, category: true }));
      const response = await getCategory();

      const categories_arr = Object.values(response.data.data).map(
        (cat) => cat
      );

      setCategories(categories_arr);
      setLoadingStates((prev) => ({ ...prev, category: false }));
    } catch (error) {
      console.log(error);
    }
  };

  const getSubCategoryData = async (categoryId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, subcategory: true }));
      // const enteredCategory = searchCategoryByName(category);

      const response = await getSubCategoryByCategoryId(categoryId);

      const subCategories_array = response.data.data.subcategory;

      setSubCategories(subCategories_array);
      setLoadingStates((prev) => ({ ...prev, subcategory: false }));
    } catch (error) {
      console.log(error);
    }
  };

  // ----------------------------------------------------

  const handleEditCategory = (name, id) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
  };

  const handleSaveCategory = async (id) => {
    await updateCategory(editCategoryName, id);
    setEditCategoryId(null);
    await getCategoryData();
  };

  const handleCancelCategory = () => {
    setEditCategoryId(null);
    setEditCategoryName("");
  };
  // ------------------------------------------------------------------------------------------------

  const handleEditSubCategory = (subCategoryName, subCategoryId) => {
    setEditSubCategoryId(subCategoryId);
    setEditSubCategoryName(subCategoryName);
  };

  const handleSaveSubCategory = async (subCategoryId) => {
    try {
      console.log(subCategoryId, editCategoryId, "ooooo");
      await updateSubCategory(editSubCategoryName, subCategoryId);
      setEditSubCategoryId(null);
      const catId = getCategoryBySubcategoryId(subCategoryId);
      await getSubCategoryData(catId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelSubCategory = () => {
    setEditSubCategoryId(null);
    setEditSubCategoryName("");
  };

  useEffect(() => {
    getCategoryData();
    getProducts();
  }, []);

  const addProductHandler = async (e) => {
    e.preventDefault();
    try {
      const currentStatus =
        e.submitter.textContent === "Add Product" ? "published" : "draft";
      setFormData((prev) => ({ ...prev, status: currentStatus }));

      console.log(formData, "FFFFFOOORRRRMm");
      await createProduct(formData);
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      const products = await getProducts();
      console.log(products);
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------------------------------------------------------------------------------------

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        alignItems: "center",
        border: "1px solid red",
        height: "100vh",
        display: "flex",
        padding: "2rem",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {[
          "Dashboard",
          "Products",
          "Add New Product",
          "Customers",
          "Orders",
          "Team",
        ].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontSize: "18px",
                  fontWeight: "semi-bold",
                  color: "#8668df",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
    setFormData({ ...formData, _attributes: savedVariants });
  }, [savedVariants]);

  // Dropzone for multiple images
  const {
    getRootProps: getRootPropsMultiple,
    getInputProps: getInputPropsMultiple,
    isDragActive: isDragActiveMultiple,
  } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      setFormData({
        ...formData,
        productImage: [...formData.productImage, ...acceptedFiles],
      });
    },

    maxFiles: 5, // Limit to 5 images for multiple upload
  });

  // Dropzone for single image
  const {
    getRootProps: getRootPropsSingle,
    getInputProps: getInputPropsSingle,
    isDragActive: isDragActiveSingle,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData({ ...formData, artisanImage: acceptedFiles[0] });
      }
    },
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    maxFiles: 1, // Limit to 1 image
  });

  return (
    <div>
      <nav
        className="admin_navbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          backgroundColor: "#5f3dc3",
          color: "#fff",
        }}
      >
        <article style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Menu Icon and Drawer */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon style={{ color: "#fff" }} />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </Box>

          {/* Avatar and Admin Details */}
          <Avatar
            alt="Rishit"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 56, height: 56, border: "2px solid #fff" }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.2,
            }}
          >
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>
              Rishit
            </h1>
            <h2 style={{ margin: 0, fontSize: "1rem", color: "#ddd" }}>
              Admin
            </h2>
          </Box>
        </article>

        <article
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              width: "250px",
              backgroundColor: "transparent",
              color: "#fff",
              outline: "none",
            }}
          />

          {/* Notification Icon */}
          <div>
            <img
              src={notificationIcon}
              alt="Notification Icon"
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
                visibility: notificationIcon ? "visible" : "hidden",
              }}
            />
          </div>

          {/* Logout Icon */}
          <div>
            <img
              src={adminLogoutIcon}
              alt="Admin Logout Icon"
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
              }}
            />
          </div>
        </article>
      </nav>

      <section>
        <main>
          <div className="form-container">
            {/* Header */}
            <div className="form-header">
              <h1 className="form-title">Add Product</h1>
            </div>

            {/* Main Form */}
            <form onSubmit={addProductHandler}>
              <div className="form-main">
                {/* Left Section: Image Upload */}
                <div className="image-upload">
                  <h2>Upload Image </h2>
                  <div
                    {...getRootPropsMultiple()}
                    className={`image-upload-area ${isDragActiveMultiple ? "active" : ""}`}
                    style={{
                      border: "2px dashed #ccc",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input {...getInputPropsMultiple()} />
                    {isDragActiveMultiple ? (
                      <p>Drop the files here...</p>
                    ) : (
                      <p>Drag & Drop your files or click to browse</p>
                    )}
                  </div>
                  {/* Image Thumbnails */}
                  <div
                    className="image-thumbnails"
                    style={{ marginTop: "20px" }}
                  >
                    {formData.productImage.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          margin: "10px",
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Section: Form */}
                <div className="form-fields">
                  <h2>New Product Details</h2>

                  <article>
                    <div>
                      <TextField
                        sx={{
                          width: "100%",
                        }}
                        id="productTitle"
                        label="Product & Title"
                        variant="outlined"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <TextField
                        sx={{ width: "100%" }}
                        id="productQuantity"
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: e.target.value,
                          })
                        }
                      />
                    </div>
                  </article>
                  {/* -----------------------------------------------Category Section----------------------------------------------------------------------------------------- */}
                  <article>
                    <div>
                      <Autocomplete
                        sx={{ width: "100%" }}
                        disablePortal
                        options={categories}
                        getOptionLabel={(option) => option?.name || ""}
                        value={
                          categories.find(
                            (cat) => cat._id === formData.category
                          ) || null
                        }
                        onChange={(e, newCategory) => {
                          getSubCategoryData(newCategory._id);
                          setFormData({
                            ...formData,
                            category: newCategory._id,
                            subCategory: "",
                          });
                        }}
                        loading={loadingStates.category}
                        renderInput={(params) => (
                          <TextField {...params} label="Category" />
                        )}
                      />
                    </div>
                    <Box sx={{ display: "flex" }}>
                      <div>
                        <IconButton
                          color="primary"
                          sx={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#5f3dc3",
                            color: "white",
                            borderRadius: "0.4rem",
                            "&:hover": {
                              backgroundColor: "#5f3dc3",
                            },
                          }}
                          onClick={() => setAddCategoryPopup(true)}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                      <div>
                        <IconButton
                          sx={{
                            color: "white",
                            width: "100%",
                            backgroundColor: "#5f3dc3",
                            borderRadius: "0.4rem",
                            "&:hover": {
                              backgroundColor: "#5f3dc3",
                            },
                          }}
                          size="small"
                          onClick={() => setViewCategoriesPopup(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    </Box>

                    {/* ----------------------------------------------ADD Category Dialog Box-------------------------------------------------------------------------- */}

                    <Dialog
                      open={addCategoryPopup}
                      onClose={() => setAddCategoryPopup(false)}
                      maxWidth="sm"
                      sx={{
                        "& .MuiDialog-paper": {
                          width: "80%",
                          maxHeight: "80%",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <DialogTitle sx={{ fontSize: "1.8rem" }}>
                        Add Category
                      </DialogTitle>
                      <DialogContent>
                        <Box
                          component="form"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <TextField
                            autoFocus
                            margin="dense"
                            id="categoryName"
                            label=""
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                          />
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ padding: "0 2.4rem 1.6rem" }}>
                        <Button
                          size="large"
                          onClick={() => setAddCategoryPopup(false)}
                          variant="contained"
                          sx={{
                            backgroundColor: "#d32f2f",
                            minWidth: "8rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="large"
                          onClick={handleAddCategory}
                          variant="contained"
                          sx={{
                            backgroundColor: "#5f3dc3",
                            minWidth: "8rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Add
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/* ----------------------------------------------EDIT Category Dialog Box-------------------------------------------------------------------------- */}

                    <Dialog
                      open={viewCategoriesPopup}
                      onClose={() => setViewCategoriesPopup(false)}
                      maxWidth="sm"
                      sx={{
                        "& .MuiDialog-paper": {
                          width: "80%", // Adjusts width relative to the viewport
                          maxHeight: "80%", // Ensures dialog doesn't overflow vertically
                        },
                      }}
                    >
                      <DialogTitle
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "1.8rem",
                          fontWeight: "400",
                          position: "relative",
                        }}
                      >
                        Categories
                        <IconButton
                          aria-label="close"
                          onClick={() => setViewCategoriesPopup(false)}
                          sx={{
                            position: "absolute",
                            right: "1.6rem",
                            top: "1.6rem",
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </DialogTitle>
                      <DialogContent>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            marginY: "0.5rem",
                          }}
                        >
                          {categories.map((category) => (
                            <Box
                              key={category._id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom: "1px solid #e0e0e0",
                                padding: "1rem",
                                "&:hover": {
                                  backgroundColor: "#f9f9f9",
                                },
                              }}
                            >
                              {editCategoryId === category._id ? (
                                // Render input field if this category is being edited
                                <TextField
                                  value={editCategoryName}
                                  onChange={(e) =>
                                    setEditCategoryName(e.target.value)
                                  }
                                  size="small"
                                  autoFocus
                                />
                              ) : (
                                // Otherwise render the category name
                                <Typography
                                  sx={{
                                    fontSize: "1.6rem",
                                    color: "#4a4a4a",
                                  }}
                                >
                                  {category.name}
                                </Typography>
                              )}
                              <Box sx={{ display: "flex", gap: 1 }}>
                                {editCategoryId === category._id ? (
                                  // Show save and cancel buttons during editing
                                  <>
                                    <Tooltip title="Save">
                                      <IconButton
                                        aria-label="save"
                                        color="primary"
                                        onClick={() =>
                                          handleSaveCategory(category._id)
                                        }
                                      >
                                        <CheckIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                      <IconButton
                                        aria-label="cancel"
                                        color="error"
                                        onClick={handleCancelCategory}
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : (
                                  // Show edit and delete buttons when not editing
                                  <>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() =>
                                          handleEditCategory(
                                            category.name,
                                            category._id
                                          )
                                        }
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() =>
                                          handleDeleteCategory(category._id)
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </DialogContent>
                    </Dialog>
                  </article>
                  <article>
                    <TextField
                      sx={{ width: "100%" }}
                      id="productCategory "
                      label="Description"
                      multiline
                      rows={4}
                      variant="outlined"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </article>
                  {/* -----------------------------------------------Sub Category Section----------------------------------------------------------------------------------------- */}
                  <article>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "0.3fr 0.2fr 0.3fr 0.1fr 0.1fr",
                        gap: 2,
                      }}
                    >
                      <div>
                        <TextField
                          sx={{ width: "100%" }}
                          id="price"
                          label="Price (₹)"
                          variant="outlined"
                          type="number"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          sx={{ width: "100%" }}
                          id="discount"
                          label="Discount (%)"
                          variant="outlined"
                          type="number"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discountPercentage: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Autocomplete
                          sx={{ width: "100%" }}
                          disablePortal
                          options={subCategories}
                          getOptionLabel={(option) => option?.name || ""}
                          value={
                            subCategories.find(
                              (subCat) => subCat._id === formData.subCategory
                            ) || null
                          }
                          loading={loadingStates.subcategory}
                          onChange={(e, newValue) => {
                            setFormData({
                              ...formData,
                              subCategory: newValue._id,
                            });
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="Sub Category" />
                          )}
                        />
                      </div>

                      <div style={{ minWidth: "5rem" }}>
                        <IconButton
                          color="primary"
                          sx={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#5f3dc3",
                            color: "white",
                            borderRadius: "0.4rem",
                            "&:hover": {
                              backgroundColor: "#5f3dc3",
                            },
                          }}
                          onClick={() => setAddSubCategoryPopup(true)}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                      <div style={{ minWidth: "5rem" }}>
                        <IconButton
                          sx={{
                            color: "white",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#5f3dc3",
                            borderRadius: "0.4rem",
                            "&:hover": {
                              backgroundColor: "#5f3dc3",
                            },
                          }}
                          size="small"
                          onClick={() => setViewSubCategoriesPopup(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    </Box>
                    {/* ----------------------------------------------ADD Sub Category Dialog Box-------------------------------------------------------------------------- */}
                    <Dialog
                      open={addSubCategoryPopup}
                      onClose={() => setAddSubCategoryPopup(false)}
                      maxWidth="sm"
                      sx={{
                        "& .MuiDialog-paper": {
                          width: "80%",
                          maxHeight: "80%",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <DialogTitle sx={{ fontSize: "1.8rem" }}>
                        Add Sub Category
                      </DialogTitle>
                      <DialogContent>
                        <Box
                          component="form"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            marginY: "1rem",
                          }}
                        >
                          <Autocomplete
                            sx={{ width: "100%" }}
                            disablePortal
                            options={categories}
                            getOptionLabel={(option) => option?.name || ""}
                            value={parentCategory}
                            onChange={(e, newValue) =>
                              setParentCategory(newValue)
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="Parent Category" />
                            )}
                          />
                          <TextField
                            autoFocus
                            margin="dense"
                            id="categoryName"
                            label="Sub Category Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={subCategoryName}
                            onChange={(e) => {
                              setSubCategoryName(e.target.value);
                            }}
                          />
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ padding: "0 2.4rem 1.6rem" }}>
                        <Button
                          onClick={() => setAddSubCategoryPopup(false)}
                          variant="contained"
                          sx={{
                            backgroundColor: "#d32f2f",
                            minWidth: "8rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddSubCategory}
                          variant="contained"
                          sx={{
                            backgroundColor: "#5f3dc3",
                            minWidth: "8rem",
                            fontSize: "1.2rem",
                          }}
                        >
                          Add
                        </Button>
                      </DialogActions>
                    </Dialog>
                    {/* ----------------------------------------------EDIT Sub Category Dialog Box-------------------------------------------------------------------------- */}
                    <Dialog
                      open={viewSubCategoriesPopup}
                      onClose={() => setViewSubCategoriesPopup(false)}
                      maxWidth="sm"
                      sx={{
                        "& .MuiDialog-paper": {
                          width: "80%",
                          maxHeight: "80%",
                          borderRadius: "12px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <DialogTitle sx={{ fontSize: "1.8rem" }}>
                        Sub Category
                        <IconButton
                          aria-label="close"
                          onClick={() => setViewSubCategoriesPopup(false)}
                          sx={{
                            position: "absolute",
                            right: "1.6rem",
                            top: "1.6rem",
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </DialogTitle>
                      <DialogContent>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          {subCategories.map((subCategory) => (
                            <Box
                              key={subCategory._id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "1rem 0",
                                borderBottom: "1px solid #e0e0e0",
                                "&:hover": {
                                  backgroundColor: "#f9f9f9",
                                },
                              }}
                            >
                              {editSubCategoryId === subCategory._id ? (
                                // Render input field if this subcategory is being edited
                                <TextField
                                  value={editSubCategoryName}
                                  onChange={(e) =>
                                    setEditSubCategoryName(e.target.value)
                                  }
                                  size="small"
                                  autoFocus
                                />
                              ) : (
                                // Otherwise render the subcategory name
                                <Typography
                                  sx={{ fontSize: "1.4rem", color: "#4a4a4a" }}
                                >
                                  {subCategory.name}
                                </Typography>
                              )}
                              <Box sx={{ display: "flex", gap: 1 }}>
                                {editSubCategoryId === subCategory._id ? (
                                  // Show save and cancel buttons during editing
                                  <>
                                    <Tooltip title="Save">
                                      <IconButton
                                        aria-label="save"
                                        color="primary"
                                        onClick={() =>
                                          handleSaveSubCategory(subCategory._id)
                                        }
                                      >
                                        <CheckIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                      <IconButton
                                        aria-label="cancel"
                                        color="error"
                                        onClick={handleCancelSubCategory}
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : (
                                  // Show edit and delete buttons when not editing
                                  <>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        aria-label="edit"
                                        color="primary"
                                        onClick={() =>
                                          handleEditSubCategory(
                                            subCategory.name,
                                            subCategory._id
                                          )
                                        }
                                        sx={{ color: "#5f3dc3" }}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        aria-label="delete"
                                        color="error"
                                        onClick={() =>
                                          handleDeleteSubCategory(
                                            subCategory._id
                                          )
                                        }
                                        sx={{ color: "#d32f2f" }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </DialogContent>
                    </Dialog>
                  </article>

                  <article className="addVariant_container">
                    <Box sx={{ margin: "auto" }}>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenDialog(null)}
                        sx={{ backgroundColor: "#5f3dc3" }}
                      >
                        Add Variant
                      </Button>

                      {/* Saved Variants Display */}
                      <div className="attributeCards_container">
                        {savedVariants.map((variant) => (
                          <Paper
                            key={variant.key}
                            elevation={3}
                            sx={{
                              padding: 2,

                              display: "flex",
                              flexDirection: "column",
                              flexWrap: "wrap",
                              flex: 1,
                              boxShadow: "none",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold" }}
                              >
                                {variant.key}
                              </Typography>

                              <Box>
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleOpenDialog(variant)} // Pass the variant to edit
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleDeleteSavedVariant(variant.key)
                                  } // Delete handler
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                marginTop: 1,
                              }}
                            >
                              {variant.value.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Paper>
                        ))}
                      </div>

                      {/* Dialog for Add/Edit Variant */}
                      <Dialog
                        open={isVariantDialogOpen}
                        onClose={handleCloseDialog}
                        maxWidth="sm"
                        fullWidth
                      >
                        <DialogTitle>
                          {isEditing
                            ? "Edit Product Variant"
                            : "Add Product Variant"}
                        </DialogTitle>

                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            label="Variant Option (e.g., Size)"
                            fullWidth
                            value={variantOption}
                            onChange={(e) => setVariantOption(e.target.value)}
                            sx={{ marginBottom: 2 }}
                          />

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "0.8fr 0.2fr",

                              gap: 2,
                              marginBottom: 2,
                            }}
                          >
                            <div>
                              <TextField
                                label="Variant Value"
                                value={currentVariantValue}
                                onChange={(e) =>
                                  setCurrentVariantValue(e.target.value)
                                }
                                sx={{ width: "100%" }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddValue();
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Button
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                }}
                                variant="outlined"
                                onClick={handleAddValue}
                                disabled={!currentVariantValue.trim()}
                              >
                                Add Value
                              </Button>
                            </div>
                          </Box>

                          {/* Display added values as chips */}
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {variantValues?.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                onDelete={() => handleDeleteValue(value)}
                              />
                            ))}
                          </Box>
                        </DialogContent>

                        <DialogActions>
                          <Button
                            onClick={handleCloseDialog}
                            sx={{
                              lineHeight: "normal",
                              padding: "1rem 2rem",
                            }}
                            color="error"
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            variant="contained"
                            sx={{
                              backgroundColor: "#5f3dc3",
                              lineHeight: "normal",
                              padding: "1rem 2rem",
                            }}
                            disabled={
                              !variantOption || variantValues?.length === 0
                            }
                          >
                            {isEditing ? "Update Variant" : "Save Variant"}
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  </article>

                  <article>
                    <TextField
                      sx={{ width: "100%" }}
                      id="productTitle"
                      label="Artisans Name"
                      variant="outlined"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          artisanName: e.target.value,
                        })
                      }
                    />
                    <div className="artisan_image-desc_container">
                      <div
                        {...getRootPropsSingle()}
                        className={`image-upload-area ${isDragActiveSingle ? "active" : ""}`}
                        style={{
                          border: "2px dashed #ccc",
                          padding: "20px",
                          textAlign: "center",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <input {...getInputPropsSingle()} />
                        {isDragActiveSingle ? (
                          <p>Drop the file here...</p>
                        ) : (
                          <p>Drag & Drop a file or click to browse</p>
                        )}

                        {/* Show the image inside the dotted area */}
                        {formData.artisanImage && (
                          <img
                            src={URL.createObjectURL(formData.artisanImage)}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              zIndex: 1, // Ensure the image appears above the text
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <TextField
                          sx={{ width: "100%" }}
                          id="aboutArtisan"
                          label="About Artisan"
                          multiline
                          rows={8}
                          value={formData.artisanAbout}
                          variant="outlined"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              artisanAbout: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </article>
                  <article>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "end",
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{ backgroundColor: "#5f3dc3" }}
                      >
                        Add Product
                      </Button>
                      <Button type="submit" variant="outlined" color="success">
                        Save As Draft
                      </Button>
                    </Box>
                  </article>
                </div>
                {/* Sidebar */}
                <SidebarDraft />
              </div>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
}
