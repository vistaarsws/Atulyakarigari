import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "../../services/user/userAPI"; // Add remove API
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

// Remove Item from Cart
export const removeFromTheCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      await removeFromCart(productId); // Call API to remove item
      return productId; // ✅ Return productId so we can remove it from Redux state
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ADD Item to Cart
export const addToTheCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await addToCart(productId, quantity);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    error: null,
    status: "idle",
  },
  reducers: {
    // addToCart: (state, action) => {
    //   state.items.push(action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items; // Ensure API response structure is correct
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeFromTheCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload
        );
      })
      .addCase(removeFromTheCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      // ✅ Handle Adding Item to Redux State
      .addCase(addToTheCart.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingItem = state.items.find(
          (item) => item.productId === newItem.productId
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity; // ✅ Update quantity if item exists
        } else {
          state.items.push(newItem); // ✅ Add new item if not in cart
        }
      })
      .addCase(addToTheCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
