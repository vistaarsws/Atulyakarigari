import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import LoadingButton from "@mui/lab/LoadingButton";

import "./ProductForm.css";

import {
  IconButton,
  Autocomplete,
  Button,
  TextField,
  Chip,
  Box,
  Typography,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { Add, Remove, Save } from "@mui/icons-material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  // getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByCategoryId,
} from "../../../../services/admin/adminAPI";

import {
  createProduct,
  updateProduct,
} from "../../../../services/user/userAPI";

import { Add as AddIcon } from "@mui/icons-material";
import {
  AddCategoryDialog,
  AddEditVariantDialog,
  AddSubCategoryDialog,
  ViewSubCategoryDialog,
  ViewCategoriesDialog,
} from "../dialogs/Dialogs";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ProductForm({
  productDetails,
  isProductEditing,
  closeDialog,
}) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(() => ({
    name: productDetails?.name || "",
    productImage: productDetails?.images || [],
    // description: productDetails?.description || "",
    detailDescription: productDetails?.detailDescription || [],
    price: productDetails?.price || "",
    category: productDetails?.category || null,
    subcategory: productDetails?.subcategory || "",
    sku: productDetails?.sku || "",
    weight: productDetails?.weight || "",
    length: productDetails?.length || "",
    width: productDetails?.width || "",
    height: productDetails?.height || "",
    _attributes: productDetails?.attributes || [],
    stock: productDetails?.stock || "",
    status: productDetails?.status || "",
    discountPercentage: productDetails?.discountPercentage || "",
    artisanName: productDetails?.artisanName || "",
    artisanAbout: productDetails?.artisanAbout || "",
    artisanImage: productDetails?.artisanImage || null,
  }));

  const [loadingStates, setLoadingStates] = useState({
    category: false,
    subcategory: false,
    addCategory: false,
    addSubCategory: false,
    addProduct: false,
    draftProduct: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  // const [dialogState, setDialogState] = useState({});
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [variantOption, setVariantOption] = useState("");
  const [variantValues, setVariantValues] = useState([]);
  const [currentVariantValue, setCurrentVariantValue] = useState("");
  const [savedVariants, setSavedVariants] = useState(() =>
    productDetails ? productDetails.attributes : []
  );
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
  const [details, setDetails] = useState([{ title: "", description: "" }]);
  const [savedData, setSavedData] = useState([]);

  // Handle input changes
  const handleChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  // Add new empty entry
  const addField = () => {
    setDetails([...details, { title: "", description: "" }]);
  };

  // Remove a specific entry
  const removeField = (index) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  // Save Data to State
  const handleSaveDetailDescription = () => {
    setDetails(details);
    console.log("Saved Data:", details);
  };

  const initialState = {
    name: "",
    productImage: [],
    description: "",
    detailDescription: [],
    price: "",
    category: null,
    subcategory: "",
    sku: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    _attributes: [],
    stock: "",
    status: "",
    discountPercentage: "",
    artisanName: "",
    artisanAbout: "",
    artisanImage: null,
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
    // Normalize variantValues to always be an array
    const normalizedValues = Array.isArray(variantValues)
      ? variantValues
      : [variantValues]; // If it's not an array, convert it to an array

    if (isEditing && variantToEdit) {
      // Update an existing variant
      setSavedVariants((prev) =>
        prev.map((variant) =>
          variant.key === variantToEdit
            ? { ...variant, key: variantOption, value: normalizedValues }
            : variant
        )
      );
    } else {
      // Add a new variant
      setSavedVariants((prev) => [
        ...prev,
        { key: variantOption, value: normalizedValues },
      ]);
    }

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
      setLoadingStates({ ...loadingStates, addCategory: true });
      setAddCategoryPopup(false);
      await createCategory(categoryName);
      await getCategoryData();
      setCategoryName("");
      setLoadingStates({ ...loadingStates, addCategory: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddSubCategory = async () => {
    try {
      setLoadingStates({ ...loadingStates, addSubCategory: true });
      const parentCatId = parentCategory._id;
      await createSubCategory(subCategoryName, parentCatId);
      await getSubCategoryData(parentCatId);
      setAddSubCategoryPopup(false);
      setSubCategoryName("");
      setParentCategory("");
      setLoadingStates({ ...loadingStates, addSubCategory: false });
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

      // dispatch(setSubCategories(subCategories_array));
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
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    getCategoryData();
    if (productDetails) {
      getSubCategoryData(productDetails.category);
    }
  }, []);

  // --------------------------------------------------------------------------------------------------------

  const productFormHandler = async (e) => {
    e.preventDefault();
    const buttonClicked = e.nativeEvent.submitter?.value;
    try {
      setLoadingStates({
        ...loadingStates,
        addProduct: buttonClicked !== "Draft",
        draftProduct: buttonClicked === "Draft",
      });

      const formDataInstance = new FormData();

      formDataInstance.append("name", formData?.name);
      // formDataInstance.append("description", formData?.description);
      formDataInstance.append("price", Number(formData?.price).toFixed(0));
      formDataInstance.append("category", formData?.category);
      formDataInstance.append("subcategory", formData?.subcategory);
      formDataInstance.append("stock", formData?.stock);
      formDataInstance.append("status", buttonClicked || formData?.status);
      formDataInstance.append(
        "discountPercentage",
        formData?.discountPercentage
      );
      formDataInstance.append("artisanName", formData?.artisanName);
      formDataInstance.append("artisanAbout", formData?.artisanAbout);

      formDataInstance.append("sku", formData?.sku);
      formDataInstance.append("weight", formData?.weight);
      formDataInstance.append("lenght", formData?.length);
      formDataInstance.append("width", formData?.width);
      formDataInstance.append("height", formData?.height);

      // Serialize _attributes
      if (formData._attributes) {
        formDataInstance.append(
          "_attributes",
          JSON.stringify([...formData?._attributes])
        );
      }

      if (formData.detailDescription) {
        setDetails(details);
        formDataInstance.append(
          "detailDescription",
          JSON.stringify([...details])
        );
      }

      const appendFiles = async (key, files) => {
        // Clear the key from formDataInstance
        formDataInstance.delete(key);

        if (!files) return; // Exit if no files are provided

        const urlToFile = async (url, filename) => {
          const response = await fetch(url);
          const blob = await response.blob();
          return new File([blob], filename, { type: blob.type });
        };

        const appendSingle = async (file) => {
          // If it's a new File upload, append it
          if (file instanceof File) {
            formDataInstance.append(key, file);
          }
          // If it's an unchanged image URL, convert to a File and append
          else if (typeof file === "string" && file.startsWith("http")) {
            const filename = file.split("/").pop() || "file"; // Extract filename from URL
            const fileFromUrl = await urlToFile(file, filename);
            formDataInstance.append(key, fileFromUrl);
          }
        };

        // If `files` is an array, process each item, otherwise process the single file
        if (Array.isArray(files)) {
          for (const file of files) {
            await appendSingle(file);
          }
        } else {
          await appendSingle(files);
        }
      };

      // Usage
      await appendFiles("productImage", formData?.productImage);
      await appendFiles("artisanImage", formData?.artisanImage);

      // Debugging: Log the FormData content
      for (let pair of formDataInstance.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // API call
      if (isProductEditing) {
        await updateProduct(productDetails._id, formDataInstance);
      } else {
        await createProduct(formDataInstance);
      }

      setSavedVariants([]);
      setFormData(initialState);
      setLoadingStates({
        ...loadingStates,
        addProduct: false,
        draftProduct: false,
      });
      closeDialog();
    } catch (error) {
      setLoadingStates({
        ...loadingStates,
        addProduct: false,
        draftProduct: false,
      });

      console.error("Error creating product:", error);
    }
  };

  // -------------------------------------------------------------------------------------------------------------

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

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => {
        const updatedImages = [...prev.productImage];
        updatedImages[index] = file; // Replace the clicked image with the new one
        return { ...prev, productImage: updatedImages };
      });
    }
  };

  return (
    <form id="productForm" onSubmit={productFormHandler}>
      <div className="form-main">
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
            <input {...getInputPropsMultiple()} required />
            {isDragActiveMultiple ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag & Drop your files or click to browse</p>
            )}
          </div>
          {/* Image Thumbnails */}
          <div className="image-thumbnails" style={{ marginTop: "20px" }}>
            {formData.productImage.map((file, index) => (
              <div
                key={index}
                style={{ display: "inline-block", position: "relative" }}
              >
                <img
                  src={
                    typeof file === "string"
                      ? file // If file is a string, use it as the URL
                      : file instanceof File
                        ? URL.createObjectURL(file) // If it's a File object, create a preview URL
                        : "" // Fallback in case file is neither
                  }
                  alt={`Preview ${index + 1}`}
                  className="thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    margin: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById(`file-input-${index}`).click()
                  } // Trigger file input on click
                />
                <input
                  id={`file-input-${index}`}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageChange(e, index)} // Handle image change
                />
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="form-fields">
          <h2>{`${isProductEditing ? "Edit" : "New"} Product Details`} </h2>

          <article>
            <div>
              <TextField
                sx={{
                  width: "100%",
                }}
                required
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
                slotProps={{ min: 0 }}
                variant="outlined"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
              />
            </div>
          </article>

          <div>
            {/* -----------------------------------------------Category Section----------------------------------------------------------------------------------------- */}
            <article>
              <section>
                <Autocomplete
                  sx={{ width: "100%" }}
                  disablePortal
                  required
                  options={categories}
                  getOptionLabel={(option) => option?.name || ""}
                  value={
                    categories.find((cat) => cat._id === formData.category) ||
                    null
                  }
                  onChange={(e, newCategory) => {
                    getSubCategoryData(newCategory._id);
                    setFormData({
                      ...formData,
                      category: newCategory._id,
                      subcategory: "",
                    });
                  }}
                  loading={loadingStates.category}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" />
                  )}
                />
              </section>
              <section>
                <div>
                  <IconButton
                    sx={{
                      width: "5rem",
                      height: "100%",

                      backgroundColor: "#e2e3e3",
                      color: "#383737",
                      borderRadius: "0.4rem",
                      "&:hover": {
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        color: "black",
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
                      color: "#383737",
                      width: "5rem",
                      height: "100%",

                      backgroundColor: "#e2e3e3",
                      borderRadius: "0.4rem",
                      "&:hover": {
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        color: "black",
                      },
                    }}
                    size="small"
                    onClick={() => setViewCategoriesPopup(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              </section>

              {/* ----------------------------------------------ADD Category Dialog Box-------------------------------------------------------------------------- */}

              <AddCategoryDialog
                open={addCategoryPopup}
                onClose={() => setAddCategoryPopup(false)}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                handleAddCategory={handleAddCategory}
                loading={loadingStates.addCategory}
              />
              {/* ----------------------------------------------EDIT Category Dialog Box-------------------------------------------------------------------------- */}

              <ViewCategoriesDialog
                open={viewCategoriesPopup}
                onClose={() => setViewCategoriesPopup(false)}
                categories={categories}
                editCategoryId={editCategoryId}
                editCategoryName={editCategoryName}
                setEditCategoryName={setEditCategoryName}
                handleEditCategory={handleEditCategory}
                handleSaveCategory={handleSaveCategory}
                handleCancelCategory={handleCancelCategory}
                handleDeleteCategory={handleDeleteCategory}
              />
            </article>
            {/* -----------------------------------------------Sub Category Section----------------------------------------------------------------------------------------- */}
            <article>
              <section>
                <Autocomplete
                  sx={{ width: "100%" }}
                  disablePortal
                  required
                  options={subCategories}
                  getOptionLabel={(option) => option?.name || ""}
                  value={
                    subCategories.find(
                      (subCat) => subCat._id === formData.subcategory
                    ) || null
                  }
                  loading={loadingStates.subcategory}
                  onChange={(e, newValue) => {
                    setFormData({
                      ...formData,
                      subcategory: newValue ? newValue._id : "", // Ensure empty string if no value
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sub Category" />
                  )}
                />
              </section>
              <section>
                <div>
                  <IconButton
                    sx={{
                      width: "5rem",
                      height: "100%",
                      color: "#383737",
                      backgroundColor: "#e2e3e3",
                      borderRadius: "0.4rem",
                      "&:hover": {
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        color: "black",
                      },
                    }}
                    onClick={() => setAddSubCategoryPopup(true)}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
                <div>
                  <IconButton
                    sx={{
                      color: "#383737",
                      width: "5rem",
                      height: "100%",
                      backgroundColor: "#e2e3e3",
                      borderRadius: "0.4rem",
                      "&:hover": {
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        color: "black",
                      },
                    }}
                    size="small"
                    onClick={() => setViewSubCategoriesPopup(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              </section>
            </article>
          </div>

          <article>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                my: "2rem",
              }}
            >
              <div>
                <TextField
                  sx={{ width: "100%" }}
                  id="price"
                  label="Price (₹)"
                  variant="outlined"
                  required
                  value={formData.price}
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
                  value={formData.discountPercentage}
                  type="number"
                  slotProps={{ min: 0, max: 100 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercentage: e.target.value,
                    })
                  }
                />
              </div>
            </Box>
            {/* -------------------------------------------------------------------------------------------------------------------- */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                my: "2rem",
              }}
            >
              <div>
                <TextField
                  sx={{ width: "100%" }}
                  id="sku"
                  label="SKU ID"
                  variant="outlined"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sku: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <TextField
                  sx={{ width: "100%" }}
                  id="weight"
                  label="weight (gm)"
                  variant="outlined"
                  value={formData.weight}
                  type="number"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weight: e.target.value,
                    })
                  }
                />
              </div>
            </Box>
            {/* -------------------------------------------------------------------------------------------------------------------- */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 2,
                my: "2rem",
              }}
            >
              <div>
                <TextField
                  sx={{ width: "100%" }}
                  id="length"
                  label="Length"
                  variant="outlined"
                  value={formData.length}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      length: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <TextField
                  sx={{ width: "100%" }}
                  id="width"
                  label="width"
                  variant="outlined"
                  value={formData.width}
                  type="number"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      width: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <TextField
                  sx={{ width: "100%" }}
                  id="height"
                  label="height (cm)"
                  variant="outlined"
                  value={formData.height}
                  type="number"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      height: e.target.value,
                    })
                  }
                />
              </div>
            </Box>
            {/* ----------------------------------------------ADD Sub Category Dialog Box-------------------------------------------------------------------------- */}
            <AddSubCategoryDialog
              addSubCategoryPopup={addSubCategoryPopup}
              setAddSubCategoryPopup={setAddSubCategoryPopup}
              categories={categories}
              parentCategory={parentCategory}
              setParentCategory={setParentCategory}
              subCategoryName={subCategoryName}
              setSubCategoryName={setSubCategoryName}
              loadingStates={loadingStates}
              handleAddSubCategory={handleAddSubCategory}
            />
            {/* ----------------------------------------------EDIT Sub Category Dialog Box-------------------------------------------------------------------------- */}
            <ViewSubCategoryDialog
              viewSubCategoriesPopup={viewSubCategoriesPopup}
              setViewSubCategoriesPopup={setViewSubCategoriesPopup}
              subCategories={subCategories}
              editSubCategoryId={editSubCategoryId}
              editSubCategoryName={editSubCategoryName}
              setEditSubCategoryId={setEditSubCategoryId}
              setEditSubCategoryName={setEditSubCategoryName}
              handleEditSubCategory={handleEditSubCategory}
              handleSaveSubCategory={handleSaveSubCategory}
              handleCancelSubCategory={handleCancelSubCategory}
              handleDeleteSubCategory={handleDeleteSubCategory}
            />
          </article>
          {/* -----------------------------------------------Product Description----------------------------------------------------------------------------------------- */}
          <article>
            {/* <TextField
              sx={{ width: "100%" }}
              id="productCategory "
              label="Description"
              multiline
              value={formData.description}
              rows={4}
              variant="outlined"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            /> */}
          </article>
          <article className="addVariant_container">
            <Box sx={{ margin: "auto" }}>
              <Button
                variant="contained"
                onClick={() => handleOpenDialog(null)}
                sx={{
                  backgroundColor: "#d9d9d9",
                  color: "#383737",
                  boxShadow: "none",
                }}
              >
                Add Variant
              </Button>

              {/* Saved Variants Display */}
              <div className="attributeCards_container">
                {savedVariants?.map((variant) => (
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
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
                          onClick={() => handleDeleteSavedVariant(variant.key)} // Delete handler
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
                      {variant.value.map((value) => {
                        return (
                          <Chip
                            key={value}
                            label={value}
                            color="primary"
                            variant="outlined"
                          />
                        );
                      })}
                    </Box>
                  </Paper>
                ))}
              </div>

              {/* Dialog for Add/Edit Variant */}
              <AddEditVariantDialog
                isVariantDialogOpen={isVariantDialogOpen}
                handleCloseDialog={handleCloseDialog}
                handleSave={handleSave}
                isEditing={isEditing}
                variantOption={variantOption}
                setVariantOption={setVariantOption}
                currentVariantValue={currentVariantValue}
                setCurrentVariantValue={setCurrentVariantValue}
                variantValues={variantValues}
                setVariantValues={setVariantValues}
                handleAddValue={handleAddValue}
                handleDeleteValue={handleDeleteValue}
              />
            </Box>
          </article>

          <article>
            <Box
              sx={{
                width: "100%",

                maxWidth: useMediaQuery("(845px)") ? "auto" : 600,
                margin: "auto",
                p: 2,
                my: 2,
                backgroundColor: "#f3f4f6",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Detail Description
              </Typography>

              {details.map((item, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={item.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                  />
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    value={item.description}
                    onChange={(e) =>
                      handleChange(index, "description", e.target.value)
                    }
                  />
                  <IconButton
                    onClick={() => removeField(index)}
                    color="error"
                    disabled={details.length === 1}
                  >
                    <Remove />
                  </IconButton>
                </Box>
              ))}

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={addField}
                  sx={{
                    backgroundColor: "#d9d9d9",
                    color: "#383737",
                    boxShadow: "none",
                  }}
                >
                  Add More
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveDetailDescription}
                >
                  Save Data
                </Button> */}
              </Box>
            </Box>

            <TextField
              sx={{ width: "100%" }}
              id="productTitle"
              label="Artisans Name"
              variant="outlined"
              value={formData.artisanName}
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
                {formData.artisanImage &&
                  (typeof formData.artisanImage === "string" ? (
                    // If artisanImage is a URL string, use it directly
                    <img
                      src={formData.artisanImage}
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
                  ) : (
                    // If artisanImage is a File/Blob, use URL.createObjectURL
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
                  ))}
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
            {!isProductEditing && (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "end",
                }}
              >
                <LoadingButton
                  size="large"
                  loading={loadingStates.addProduct}
                  variant="contained"
                  type="submit"
                  disabled={loadingStates.draftProduct}
                  value="Published"
                  sx={{ backgroundColor: "#5f3dc3" }}
                >
                  Add Product
                </LoadingButton>

                <LoadingButton
                  size="large"
                  loading={loadingStates.draftProduct}
                  type="submit"
                  disabled={loadingStates.addProduct}
                  variant="outlined"
                  color="success"
                  value="Draft"
                >
                  Save As Draft
                </LoadingButton>
              </Box>
            )}

            {isProductEditing && (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "end",
                }}
              >
                <Button onClick={closeDialog} variant="contained" color="error">
                  Cancel
                </Button>
                <LoadingButton
                  size="large"
                  loading={loadingStates.draftProduct}
                  type="submit"
                  disabled={loadingStates.addProduct}
                  variant="contained"
                  color="warning"
                  value="Draft"
                  onClick={(e) => {
                    console.log("MANNN", e);
                    productFormHandler(e);
                  }}
                >
                  Update & Draft
                </LoadingButton>

                <LoadingButton
                  size="large"
                  // loading={loadingStates.draftProduct}
                  type="submit"
                  // disabled={loadingStates.addProduct}
                  variant="contained"
                  color="success"
                  value="Published"
                  onClick={(e) => productFormHandler(e)}
                >
                  Update Product
                </LoadingButton>
              </Box>
            )}
          </article>
        </div>
      </div>
    </form>
  );
}
