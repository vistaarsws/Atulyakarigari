import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  removeFromCart,
  addToCart,
} from "../../services/user/userAPI";
import { jwtDecode } from "jwt-decode";

// Helper Function: Track Custom Events in Dynatrace
const trackDynatraceEvent = (eventName, data) => {
  if (typeof window !== "undefined" && window.dtrum) {
    window.dtrum.sendCustomEvent(eventName, data);
  }
};

// Fetch Cart Items
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (authToken, { rejectWithValue }) => {
    try {
      const { userId } = jwtDecode(authToken);
      const response = await getCart(userId);

      trackDynatraceEvent("Fetch Cart", {
        userId,
        itemCount: response.data.data.items.length,
      });

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

      dispatch(cartSlice.actions.removeItemFromState(productId));

      const updatedCart = await dispatch(fetchCart(authToken)).unwrap();

      trackDynatraceEvent("Remove from Cart", { productId });

      return updatedCart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add Item to Cart and Fetch Updated Cart
export const addToTheCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { authToken, productId, quantity = 1 },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await addToCart(productId, quantity);

      const updatedCart = await dispatch(fetchCart(authToken)).unwrap();

      trackDynatraceEvent("Add to Cart", { productId, quantity });

      return updatedCart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update Quantity in Cart
export const updateQuantityInCart = createAsyncThunk(
  "cart/updateQuantity",
  async ({ authToken, productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const updatedCart = await dispatch(
        addToTheCart({ authToken, productId, quantity })
      ).unwrap();

      dispatch(cartSlice.actions.updateItemQuantity({ productId, quantity }));

      const totalMRP = updatedCart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      dispatch(
        cartSlice.actions.updateCartTotals({ totalMRP, total: totalMRP })
      );

      await dispatch(fetchCart(authToken)).unwrap(); // ✅ Dispatch fetchCart properly

      trackDynatraceEvent("Update Cart Quantity", { productId, quantity });

      return updatedCart;
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      return rejectWithValue(err.message || "Failed to update cart");
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
    removeItemFromState: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },

    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    updateCartTotals: (state, action) => {
      state.totalMRP = action.payload.totalMRP;
      state.total = action.payload.total;
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

export const { removeItemFromState, updateItemQuantity, updateCartTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
