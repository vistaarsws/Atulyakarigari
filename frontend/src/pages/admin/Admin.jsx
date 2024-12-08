import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Avatar,
  Drawer,
  IconButton,
  List,
  Divider,
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
} from "../../services/admin/adminAPI";

// ------------------------------ react-date-range -------------------------------------------------
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// -------------------------------------------------------------------------------------------------

import notificationIcon from "../../assets/images/notificationIcon.svg";
import adminLogoutIcon from "../../assets/images/adminLogoutIcon.svg";

import "./Admin.css";

export default function Admin() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // ------------------------------ react-date-range -------------------------------------------------

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false); // State to toggle the calendar visibility
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle opening of calendar when input is clicked
  const handleDateClick = () => {
    setIsOpen(true); // Open calendar on input click
  };
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB"); // This will return the date in "DD/MM/YYYY"
  };

  // --------------------------------------------------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

  // State for the variant option (e.g., "Size")
  const [variantOption, setVariantOption] = useState("");

  // State for managing multiple variant values
  const [variantValues, setVariantValues] = useState([]);

  // State for the current input value
  const [currentVariantValue, setCurrentVariantValue] = useState("");

  // State to store all saved variants
  const [savedVariants, setSavedVariants] = useState([]);
  const [variantToEdit, setVariantToEdit] = useState(null);

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

    console.log(savedVariants, "m111111111111111111111111111111");

    handleCloseDialog();
  };

  // Handle deleting a saved variant
  const handleDeleteSavedVariant = (optionToDelete) => {
    setSavedVariants(
      savedVariants.filter((variant) => variant.key !== optionToDelete)
    );
  };

  // const handleEditVariant = (variant) => {
  //   setIsEditing(true);
  //   setVariantOption(variant.option);
  //   setVariantValues(variant.values);
  //   handleOpenDialog();
  // };

  // const handleUpdateVariant = () => {
  //   const updatedVariants = savedVariants.map((v) =>
  //     v.option === variantOption
  //       ? { option: variantOption, values: variantValues }
  //       : v
  //   );
  //   setSavedVariants(updatedVariants);
  //   handleCloseDialog();
  // };

  // --------------------------------------------------------------------------------------------------------
  const [viewCategoriesPopup, setViewCategoriesPopup] = useState(false);
  const [viewSubCategoriesPopup, setViewSubCategoriesPopup] = useState(false);
  const [addCategoryPopup, setAddCategoryPopup] = useState(false);
  const [addSubCategoryPopup, setAddSubCategoryPopup] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: "subCategory 1" },
    { id: 2, name: "subCategory 2" },
  ]);

  const closeAddCategoryPopup = () => {
    setAddCategoryPopup(false);
    setCategoryName("");
  };

  const handleDeleteCategory = async (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
    await deleteCategory(id);
  };

  const handleAddCategory = async () => {
    console.log("Category Added:", categoryName);
    closeAddCategoryPopup();
    await createCategory(categoryName);
  };

  const getCategoryHandler = async () => {
    const response = await getCategory();
    console.log(response);
    const categories_array = Object.values(response.data.data).map(
      (category) => category
    );
    setCategories(categories_array);
    console.log("cat", categories_array);
  };

  useEffect(() => {
    getCategoryHandler();
  }, []);

  // ------------------------------------------------------------------------------------------------

  const closeAddSubCategoryPopup = () => {
    setAddSubCategoryPopup(false);
    setSubCategoryName("");
  };

  const handleDeleteSubCategory = async (id) => {
    setSubCategories((prev) => prev.filter((category) => category.id !== id));
    await deleteSubCategory(id);
  };

  const handleAddSubCategory = async () => {
    console.log("sub Category Added:", categoryName);
    closeAddSubCategoryPopup();
    await createSubCategory(categoryName);
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

  const [drafts, setDrafts] = useState([
    { title: "Banarasi Silk Saari", date: "01/09/24" },
    { title: "Designer Silk Saari", date: "01/09/24" },
    { title: "Designer Silk Saari", date: "01/09/24" },
    // Add more drafts as needed
  ]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    quantity: 1,
    description: "",
    price: "",
    discount: "",
    artisanName: "",
    images: [],
    subCategory: "",
    attributes: [],
    singleImage: null,
  });

  useEffect(() => {
    setFormData({ ...formData, attributes: savedVariants });
  }, [savedVariants]);

  // Dropzone for multiple images
  const {
    getRootProps: getRootPropsMultiple,
    getInputProps: getInputPropsMultiple,
    isDragActive: isDragActiveMultiple,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFormData({
        ...formData,
        images: [...formData.images, ...acceptedFiles],
      });
    },
    accept: "image/*", // Only accept images
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
        setFormData({ ...formData, singleImage: acceptedFiles[0] });
      }
    },
    accept: "image/*", // Only accept images
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
            <form
              onSubmit={(e) => {
                e.preventDefault;
                console.log("FORM DATA", formData);
              }}
            >
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
                    {formData.images.map((file, index) => (
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
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
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
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </div>
                  </article>
                  <article>
                    <div>
                      <Autocomplete
                        sx={{ width: "100%" }}
                        disablePortal
                        options={categories.map((c) => c.name)}
                        value={formData.category}
                        onChange={(e, newValue) =>
                          setFormData({ ...formData, category: newValue })
                        }
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
                            borderRadius: "0px",
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
                    <Dialog
                      open={addCategoryPopup}
                      onClose={closeAddCategoryPopup}
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
                            onChange={(e) => setCategoryName(e.target.value)} // Update category state on input change
                          />
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ padding: "0 2.4rem 1.6rem" }}>
                        <Button
                          size="large"
                          onClick={closeAddCategoryPopup}
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
                              <Typography
                                sx={{
                                  fontSize: "1.6rem",
                                  color: "#4a4a4a",
                                }}
                              >
                                {category.name}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                {/* Edit Icon with Tooltip */}
                                <Tooltip title="Edit">
                                  <IconButton
                                    aria-label="edit"
                                    color="primary"
                                    onClick={() => handleEditCategory(category)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                {/* Delete Icon with Tooltip */}
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
                              discount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Autocomplete
                          sx={{ width: "100%" }}
                          disablePortal
                          options={["tie", "lengha", "kurta"]}
                          value={formData.subCategory}
                          onChange={(e, newValue) =>
                            setFormData({
                              ...formData,
                              subCategory: newValue,
                            })
                          }
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

                    <Dialog
                      open={addSubCategoryPopup}
                      onClose={closeAddSubCategoryPopup}
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
                            marginY: "0.5rem",
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
                            onChange={(e) => setSubCategoryName(e.target.value)} // Update category state on input change
                          />
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ padding: "0 2.4rem 1.6rem" }}>
                        <Button
                          onClick={closeAddSubCategoryPopup}
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
                        Sub Categories
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
                            gap: 1,
                          }}
                        >
                          {subCategories.map((subCategory) => (
                            <Box
                              key={subCategory._id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom: "1px solid #e0e0e0",
                                padding: "8px 0",
                                fontSize: "1.4rem",
                                "&:hover": {
                                  backgroundColor: "#f9f9f9",
                                },
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "1.4rem", color: "#4a4a4a" }}
                              >
                                {subCategory.name}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                {/* Edit Icon with Tooltip */}
                                <Tooltip title="Edit">
                                  <IconButton
                                    aria-label="edit"
                                    color="primary"
                                    onClick={() =>
                                      handleEditSubCategory(subCategory)
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                {/* Delete Icon with Tooltip */}
                                <Tooltip title="Delete">
                                  <IconButton
                                    aria-label="delete"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteSubCategory(subCategory._id)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </DialogContent>
                      {/* <DialogActions sx={{ padding: "0 2.4rem 1.6rem" }}>
                        <Button
                          onClick={() => setViewSubCategoriesPopup(false)}
                          variant="contained"
                          size="large"
                          sx={{
                            backgroundColor: "#d32f2f",
                            fontSize: "1.2rem",
                          }}
                        >
                          Close
                        </Button>
                      </DialogActions> */}
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
                        {formData.singleImage && (
                          <img
                            src={URL.createObjectURL(formData.singleImage)}
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
                          variant="outlined"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              aboutArtisan: e.target.value,
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
                      <Button variant="outlined" color="success">
                        Save As Draft
                      </Button>
                    </Box>
                  </article>
                </div>

                {/* Sidebar */}

                <div className="draft-sidebar">
                  <div className="draft-sidebar-header">
                    <h2>Drafts</h2>

                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        readOnly
                        value={`${formatDate(range[0].startDate)} - ${formatDate(range[0].endDate)}`} // Apply the format
                        onClick={handleDateClick} // Opens the calendar when clicked
                        style={{
                          padding: "10px",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      />

                      {/* Calendar Popup */}
                      {isOpen && (
                        <div
                          ref={calendarRef} // Reference for outside click detection
                          style={{
                            position: "absolute",
                            top: "40px",
                            left: "-100%",
                            zIndex: 10,
                            background: "#fff",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                          }}
                        >
                          <DateRange
                            onChange={(item) => setRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={range}
                            showDateDisplay={false}
                            months={1}
                            direction="horizontal"
                            staticRanges={[]} // Removes predefined ranges
                            inputRanges={[]} // Removes custom input ranges
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="draft-list">
                    {drafts.map((draft, index) => (
                      <div key={index} className="draft-item">
                        <p>{draft.title}</p>
                        <span>{draft.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
}
