import { createSlice, current } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    selectedCategory: "",
    selectedSubCategory: "",
    selectedCategorySubCategories: [],
  },
  reducers: {
    // Add a new category
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },

    // Set the current selected category
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },

    // Replace all categories with fetched categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    // Add a subcategory to a specific category
    addSubCategory: (state, action) => {
      const { categoryId, subCategory } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category) {
        if (!category.subcategories) {
          category.subcategories = [];
        }
        category.subcategories.push(subCategory);
      }
    },

    // Edit a specific subcategory
    editSubCategory: (state, action) => {
      const { categoryId, subCategoryId, updatedSubCategory } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category && category.subcategories) {
        const subCategory = category.subcategories.find(
          (sub) => sub.id === subCategoryId
        );
        if (subCategory) {
          Object.assign(subCategory, updatedSubCategory);
        }
      }
    },

    // Delete a specific subcategory
    deleteSubCategoryReducer: (state, action) => {
      const { categoryId, subCategoryId } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category && category.subcategories) {
        category.subcategories = category.subcategories.filter(
          (sub) => sub.id !== subCategoryId
        );
      }
    },

    // Set all subcategories for a category
    setSubcategories: (state, action) => {
      const { categoryId, subcategories } = action.payload;
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category) {
        category.subcategories = subcategories;
      }
    },
  },
});

export const {
  setCategories,
  addCategory,
  addSubCategory,
  editSubCategory,
  deleteSubCategoryReducer,
  setSubcategories,
} = categorySlice.actions;

export default categorySlice.reducer;
