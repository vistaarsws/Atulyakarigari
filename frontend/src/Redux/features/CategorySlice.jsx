import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategory, getSubCategoryById } from "../../services/admin/adminAPI";

// Async thunk to fetch all categories
export const fetchAllCategory = createAsyncThunk(
  "category/fetchCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategory();

      const categories_arr = Object.values(response.data.data);
      return categories_arr;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

// Async thunk to fetch a subcategory by ID
export const fetchSubCategoryDataById = createAsyncThunk(
  "subCategory/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSubCategoryById(id);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch subcategory");
    }
  }
);

const initialState = {
  categories: [],
  subcategory: null, // ✅ Start as null
  loading: false,
  error: null,
  hasFetched: false,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Handle fetchAllCategory
      .addCase(fetchAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // Handle fetchSubCategoryDataById
      .addCase(fetchSubCategoryDataById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryDataById.fulfilled, (state, action) => {
        state.subcategory = action.payload; // ✅ Fix state update
        state.loading = false;
        state.hasFetched = true;
      })
      .addCase(fetchSubCategoryDataById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.subcategory = null;
      });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
