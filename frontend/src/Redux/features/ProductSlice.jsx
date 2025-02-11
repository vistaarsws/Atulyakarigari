import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../../services/user/userAPI";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await getProducts();
      return response.data.data.products;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something   went wrong";
      });
  },
});

export const { setProducts } = productSlice.actions;

export default productSlice.reducer;
