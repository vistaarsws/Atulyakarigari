import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategory } from "../../services/admin/adminAPI";

export const fetchAllCategory = createAsyncThunk(
  "category/fetchCategory",
  async () => {
    try {
      const response = await getCategory();
      const categories_arr = Object.values(response.data.data).map((cat) => ({
        id: cat._id,
        name: cat.name,
        products: cat.products,
        subcategory: cat.subcategory,
      }));
      return categories_arr;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState: initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;
