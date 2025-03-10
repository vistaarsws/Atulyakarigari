import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Autocomplete,
  Box,
  Tooltip,
  Typography,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";

// ViewCategoriesDialog Component
const ViewCategoriesDialog = ({
  open,
  onClose,
  categories,
  editCategoryId,
  editCategoryName,
  setEditCategoryName,
  handleEditCategory,
  handleSaveCategory,
  handleCancelCategory,
  handleDeleteCategory,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          width: "80%",
          maxHeight: "80%",
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
          onClick={onClose}
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
                <TextField
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  size="small"
                  autoFocus
                />
              ) : (
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
                  <>
                    <Tooltip title="Save">
                      <IconButton
                        aria-label="save"
                        color="primary"
                        onClick={() => handleSaveCategory(category._id)}
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
                  <>
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() =>
                          handleEditCategory(category.name, category._id)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDeleteCategory(category._id)}
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
  );
};

// AddCategoryDialog Component
const AddCategoryDialog = ({
  open,
  onClose,
  categoryName,
  setCategoryName,
  handleAddCategory,
  loadingStates,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle sx={{ fontSize: "1.8rem" }}>Add Category</DialogTitle>
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
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#d32f2f",
            minWidth: "8rem",
            fontSize: "1.2rem",
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          size="large"
          sx={{
            backgroundColor: "#5f3dc3",
            minWidth: "8rem",
            fontSize: "1.2rem",
          }}
          onClick={handleAddCategory}
          loading={loadingStates?.addCategory}
          variant="contained"
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const AddSubCategoryDialog = ({
  addSubCategoryPopup,
  setAddSubCategoryPopup,
  categories,
  parentCategory,
  setParentCategory,
  subCategoryName,
  setSubCategoryName,
  loadingStates,
  handleAddSubCategory,
}) => {
  return (
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
      <DialogTitle sx={{ fontSize: "1.8rem" }}>Add Sub Category</DialogTitle>
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
            onChange={(e, newValue) => setParentCategory(newValue)}
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
        <LoadingButton
          variant="contained"
          color="secondary"
          loading={loadingStates.addSubCategory}
          onClick={handleAddSubCategory}
          sx={{
            backgroundColor: "#5f3dc3",
            minWidth: "8rem",
            fontSize: "1.2rem",
          }}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const ViewSubCategoryDialog = ({
  viewSubCategoriesPopup,
  setViewSubCategoriesPopup,
  subCategories,
  editSubCategoryId,
  editSubCategoryName,
  setEditSubCategoryId,
  setEditSubCategoryName,
  handleEditSubCategory,
  handleSaveSubCategory,
  handleCancelSubCategory,
  handleDeleteSubCategory,
}) => {
  return (
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
                  onChange={(e) => setEditSubCategoryName(e.target.value)}
                  size="small"
                  autoFocus
                />
              ) : (
                // Otherwise render the subcategory name
                <Typography sx={{ fontSize: "1.4rem", color: "#4a4a4a" }}>
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
                        onClick={() => handleSaveSubCategory(subCategory._id)}
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
                        onClick={() => handleDeleteSubCategory(subCategory._id)}
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
  );
};

/* Dialog for Add/Edit Variant */
const AddEditVariantDialog = ({
  isOpen,
  onClose,
  onSave,
  variant,
  setVariant,
  variantValues,
  onAddValue,
  onDeleteValue,
}) => {
  // Local state for variant key
  const [localVariantKey, setLocalVariantKey] = useState(variant?.key || "");
  // Local state for variant value input
  const [inputValue, setInputValue] = useState("");

  // Sync local key when dialog opens
  useEffect(() => {
    setLocalVariantKey(variant?.key || "");
  }, [variant]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {variant ? "Edit Product Variant" : "Add Product Variant"}
        <IconButton
          aria-label="close"
          onClick={onClose}
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
        {/* Variant Option Input */}
        <TextField
          autoFocus
          margin="dense"
          label="Variant Option (e.g., Size)"
          fullWidth
          value={localVariantKey}
          onChange={(e) => {
            const updatedKey = e.target.value;
            setLocalVariantKey(updatedKey);
            setVariant((prev) => ({ ...prev, key: updatedKey })); // ✅ Update parent state immediately
          }}
          sx={{ marginBottom: 2 }}
        />

        {/* Variant Value Input */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "0.8fr 0.2fr",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <TextField
            label="Variant Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ width: "100%" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                onAddValue(inputValue);
                setInputValue("");
              }
            }}
          />
          <Button
            sx={{ width: "100%", height: "100%" }}
            variant="outlined"
            onClick={() => {
              onAddValue(inputValue);
              setInputValue("");
            }}
            disabled={!inputValue.trim()}
          >
            Add Value
          </Button>
        </Box>

        {/* Display Added Values as Chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {variantValues.map((value, index) => (
            <Chip
              key={index}
              label={value}
              onDelete={() => onDeleteValue(value)}
              sx={{ userSelect: "text", cursor: "text" }}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="error"
          variant="outlined"
          sx={{ lineHeight: "normal", padding: "1rem 2rem" }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setVariant((prev) => ({ ...prev, key: localVariantKey })); // Ensure key updates before saving
            onSave();
          }}
          variant="contained"
          sx={{
            backgroundColor: "#5f3dc3",
            lineHeight: "normal",
            padding: "1rem 2rem",
          }}
          disabled={!localVariantKey.trim() || variantValues.length === 0}
        >
          {variant ? "Update Variant" : "Save Variant"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export {
  ViewCategoriesDialog,
  AddCategoryDialog,
  AddSubCategoryDialog,
  ViewSubCategoryDialog,
  AddEditVariantDialog,
};
