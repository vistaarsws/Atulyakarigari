import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart } from "../../services/user/userAPI"; // Replace with actual API import
import { jwtDecode } from "jwt-decode";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (authToken, { rejectWithValue }) => {
    try {
      if (!authToken) throw new Error("No user profile token found");

      const { _id } = jwtDecode(authToken);
      if (!_id) throw new Error("Invalid token structure");

      const response = await getCart(_id);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
