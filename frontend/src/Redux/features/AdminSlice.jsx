import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addAdmin, removeAdmin } from "../../services/admin/adminAPI";

// 🔹 Add an Admin
export const addAdminThunk = createAsyncThunk("admin/addAdmin", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await addAdmin(email);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to add admin");
  }
});

// 🔹 Remove an Admin
export const removeAdminThunk = createAsyncThunk("admin/removeAdmin", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await removeAdmin(email);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to remove admin");
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [], // Manage only admin users
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAdminThunk.fulfilled, (state, action) => {
        state.admins.push(action.payload);
      })
      .addCase(removeAdminThunk.fulfilled, (state, action) => {
        state.admins = state.admins.filter((admin) => admin.email !== action.meta.arg.email);
      });
  },
});

export default adminSlice.reducer;
