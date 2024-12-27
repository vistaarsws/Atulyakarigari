import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading", // Add a name for the slice
  initialState: {
    category: false,
    subcategory: false,
    addCategory: false,
    addSubCategory: false,
    addProduct: false,
    draftProduct: false,
  },
  reducers: {
    setCategoryLoading: (state, action) => {
      state.category = action.payload;
    },
    setSubCategoryLoading: (state, action) => {
      state.subcategory = action.payload;
    },
    setAddCategoryLoading: (state, action) => {
      state.addCategory = action.payload;
    },
    setAddSubCategoryLoading: (state, action) => {
      state.addSubCategory = action.payload;
    },
    setAddProductLoading: (state, action) => {
      state.addProduct = action.payload;
    },
    setDraftProductLoading: (state, action) => {
      state.draftProduct = action.payload;
    },
  },
});

export const {
  setCategoryLoading,
  setSubCategoryLoading,
  setAddCategoryLoading,
  setAddSubCategoryLoading,
  setAddProductLoading,
  setDraftProductLoading,
} = loadingSlice.actions;

export default loadingSlice.reducer;
