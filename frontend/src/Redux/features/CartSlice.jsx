import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "../../services/user/userAPI";
import { jwtDecode } from "jwt-decode";

// Fetch Cart Items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (authToken, { rejectWithValue }) => {
    try {
      const { userId } = jwtDecode(authToken);
      const response = await getCart(userId);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Remove Item from Cart and Update Redux Immediately
export const removeFromTheCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ authToken, productId }, { rejectWithValue, dispatch }) => {
    try {
      await removeFromCart(productId);

      // ✅ Update Redux state locally first (to remove the item instantly)
      dispatch(cartSlice.actions.removeItemFromState(productId));

      // ✅ Re-fetch the updated cart from backend (to refresh totals)
      const updatedCart = await dispatch(fetchCart(authToken)).unwrap();
      return updatedCart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ADD Item to Cart and Fetch Updated Cart
export const addToTheCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { authToken, productId, quantity = 1 },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await addToCart(productId, quantity);

      // ✅ Re-fetch the updated cart from the backend after addition
      const updatedCart = await dispatch(fetchCart(authToken)).unwrap();
      return updatedCart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalDiscount: 0,
    totalMRP: 0,
    total: 0,
    error: null,
    status: "idle",
  },
  reducers: {
    // ✅ Reducer to remove item immediately from Redux state
    removeItemFromState: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.totalDiscount = action.payload.totalDiscount || 0;
        state.totalMRP = action.payload.totalMRP || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFromTheCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalDiscount = action.payload.totalDiscount || 0;
        state.totalMRP = action.payload.totalMRP || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromTheCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addToTheCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalDiscount = action.payload.totalDiscount || 0;
        state.totalMRP = action.payload.totalMRP || 0;
        state.total = action.payload.total || 0;
      })
      .addCase(addToTheCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
