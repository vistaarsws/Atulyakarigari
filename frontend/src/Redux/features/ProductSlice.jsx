import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [], // Add products array here
  currentProduct: {
    name: "",
    productImage: [],
    description: "",
    price: "",
    category: null,
    subCategory: "",
    _attributes: [],
    stock: "",
    status: "",
    discountPercentage: "",
    artisanName: "",
    artisanAbout: "",
    artisanImage: null,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    // Set the current product (for editing or creating)
    setCurrentProduct: (state, action) => {
      state.currentProduct = {
        ...state.currentProduct, // Preserve existing properties
        ...action.payload, // Merge new properties
      };
    },

    // Clear the current product (for resetting the form)
    clearCurrentProduct: (state) => {
      state.currentProduct = { ...initialState.currentProduct };
    },

    // Add a new product to the list
    addProduct: (state, action) => {
      if (action.payload) {
        state.products.push(action.payload);
      }
    },

    // Update an existing product in the list
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
      }
    },

    // Delete a product from the list
    deleteProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },

    // Set products coming from API
    setProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
    },

    // Add a new attribute to the current product
    addAttribute: (state, action) => {
      if (action.payload) {
        state.currentProduct._attributes.push(action.payload);
      }
    },

    // Update an attribute in the current product
    updateAttribute: (state, action) => {
      const { key, updatedAttribute } = action.payload || {};
      if (key) {
        state.currentProduct._attributes = state.currentProduct._attributes.map(
          (attribute) =>
            attribute.key === key
              ? { ...attribute, ...updatedAttribute }
              : attribute
        );
      }
    },

    // Delete an attribute from the current product
    deleteAttribute: (state, action) => {
      const keyToRemove = action.payload;
      if (keyToRemove) {
        state.currentProduct._attributes =
          state.currentProduct._attributes.filter(
            (attribute) => attribute.key !== keyToRemove
          );
      }
    },
  },
});

export const {
  setCurrentProduct,
  clearCurrentProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
  addAttribute,
  updateAttribute,
  deleteAttribute,
} = productSlice.actions;

export default productSlice.reducer;
