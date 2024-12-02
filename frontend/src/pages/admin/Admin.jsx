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
} from "@mui/material";

import { Menu as MenuIcon, Add as AddIcon } from "@mui/icons-material";

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

  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);

  // State for the variant option (e.g., "Size")
  const [variantOption, setVariantOption] = useState("");

  // State for managing multiple variant values
  const [variantValues, setVariantValues] = useState([]);

  // State for the current input value
  const [currentVariantValue, setCurrentVariantValue] = useState("");

  // State to store all saved variants
  const [savedVariants, setSavedVariants] = useState([]);

  // Open the dialog
  const handleOpenDialog = () => {
    setIsVariantDialogOpen(true);
  };

  // Close the dialog and reset states
  const handleCloseDialog = () => {
    setIsVariantDialogOpen(false);
    setVariantOption("");
    setVariantValues([]);
    setCurrentVariantValue("");
  };

  // Add a new value to the variants
  const handleAddValue = () => {
    if (
      currentVariantValue.trim() &&
      !variantValues.includes(currentVariantValue.trim())
    ) {
      setVariantValues([...variantValues, currentVariantValue.trim()]);
      setCurrentVariantValue("");
    }
  };

  // Remove a value from the variants
  const handleDeleteValue = (valueToDelete) => {
    setVariantValues(variantValues.filter((value) => value !== valueToDelete));
  };

  // Handle saving the variant
  const handleSave = () => {
    if (variantOption && variantValues.length > 0) {
      const newVariant = {
        option: variantOption,
        values: variantValues,
      };

      setSavedVariants([...savedVariants, newVariant]);
      handleCloseDialog();
    }
  };

  // Handle deleting a saved variant
  const handleDeleteSavedVariant = (optionToDelete) => {
    setSavedVariants(
      savedVariants.filter((variant) => variant.option !== optionToDelete)
    );
  };
  // --------------------------------------------------------------------------------------------------------
  const [openPopup, setOpenPopup] = useState(false); // State to control dialog visibility
  const [categoryName, setCategoryName] = useState(""); // State to hold the input value

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setCategoryName(""); // Reset category input field when closing
  };

  const handleAddCategory = () => {
    // Handle category addition logic here
    console.log("Category Added:", categoryName);
    handleClosePopup();
  };
  // --------------------------------------------------------------------------------------------------------

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const [drafts, setDrafts] = useState([
    { title: "Banarasi Silk Saari", date: "01/09/24" },
    { title: "Designer Silk Saari", date: "01/09/24" },
    // Add more drafts as needed
  ]);

  const [formData, setFormData] = useState({
    title: "",
    color: "",
    category: "",
    quantity: 1,
    description: "",
    price: "",
    discountPrice: "",
    size: "",
    artisanName: "",
    images: [],
    singleImage: null,
  });

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
      <nav className="admin_navbar">
        <article>
          <div>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </div>
          <Avatar
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
            sx={{ width: 56, height: 56 }}
          />
          <div>
            <h1>Rishit</h1>
            <h2>Admin</h2>
          </div>
        </article>
        <article>
          <div>
            <img src={notificationIcon} alt="Notification Icon" />
          </div>
          <div>
            <img src={adminLogoutIcon} alt="Admin Logout Icon" />
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
                <div className="image-thumbnails" style={{ marginTop: "20px" }}>
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
                      sx={{ width: "100%" }}
                      id="productTitle"
                      label="Product & Title"
                      variant="outlined"
                    />
                  </div>
                  <div>
                    <TextField
                      sx={{ width: "100%" }}
                      id="productQuantity"
                      label="Quantity"
                      type="number"
                      variant="outlined"
                    />
                  </div>
                </article>
                <article>
                  <div>
                    <Autocomplete
                      sx={{ width: "100%" }}
                      disablePortal
                      options={["handloom", "artisans", "handicraft"]}
                      renderInput={(params) => (
                        <TextField {...params} label="Category" />
                      )}
                    />
                  </div>
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
                      onClick={handleOpenPopup}
                    >
                      <AddIcon />
                    </IconButton>
                    <Dialog open={openPopup} onClose={handleClosePopup}>
                      <DialogTitle>Add Category</DialogTitle>
                      <DialogContent>
                        <Box
                          component="form"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <TextField
                            autoFocus
                            margin="dense"
                            id="categoryName"
                            label="Category Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)} // Update category state on input change
                          />
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClosePopup} color="secondary">
                          Cancel
                        </Button>
                        <Button onClick={handleAddCategory} color="primary">
                          Add
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </article>
                <article>
                  <TextField
                    sx={{ width: "100%" }}
                    id="productCategory "
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </article>
                <article>
                  <TextField
                    sx={{ width: "100%" }}
                    id="productTitle"
                    label="Artisans Name"
                    variant="outlined"
                  />
                </article>
                <article>
                  <Box sx={{ maxWidth: 600, margin: "auto" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenDialog}
                      sx={{ marginBottom: 2 }}
                    >
                      Add Variant
                    </Button>

                    {/* Saved Variants Display */}
                    {savedVariants.map((variant) => (
                      <Paper
                        key={variant.option}
                        elevation={3}
                        sx={{
                          padding: 2,
                          marginBottom: 2,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {variant.option}
                          </Typography>
                          <Button
                            color="error"
                            size="small"
                            onClick={() =>
                              handleDeleteSavedVariant(variant.option)
                            }
                          >
                            Delete
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            marginTop: 1,
                          }}
                        >
                          {variant.values.map((value) => (
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

                    <Dialog
                      open={isVariantDialogOpen}
                      onClose={handleCloseDialog}
                      maxWidth="sm"
                      fullWidth
                    >
                      <DialogTitle>Add Product Variant</DialogTitle>

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
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            marginBottom: 2,
                          }}
                        >
                          <TextField
                            label="Variant Value"
                            value={currentVariantValue}
                            onChange={(e) =>
                              setCurrentVariantValue(e.target.value)
                            }
                            sx={{ flexGrow: 1 }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddValue();
                              }
                            }}
                          />
                          <Button
                            variant="outlined"
                            onClick={handleAddValue}
                            disabled={!currentVariantValue.trim()}
                          >
                            Add Value
                          </Button>
                        </Box>

                        {/* Display added values as chips */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {variantValues.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              onDelete={() => handleDeleteValue(value)}
                            />
                          ))}
                        </Box>
                      </DialogContent>

                      <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          color="primary"
                          disabled={
                            !variantOption || variantValues.length === 0
                          }
                        >
                          Save Variant
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </article>
                <article>
                  <div className="image-upload">
                    <h2>Upload Single Image</h2>
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
                  </div>
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
          </div>
        </main>
      </section>
    </div>
  );
}
