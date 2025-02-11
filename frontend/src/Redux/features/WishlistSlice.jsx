import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserWishlist } from "../../services/user/userAPI"; // Replace with actual API import
import { jwtDecode } from "jwt-decode";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (authToken, { rejectWithValue }) => {
    try {
      const { userId } = jwtDecode(authToken);
      const response = await getUserWishlist(userId);
      return response.data.data.wishlist.items;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    // status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    addToWishlist: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
