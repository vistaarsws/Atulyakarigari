import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile, updateProfile } from "../../services/user/userAPI";
import { jwtDecode } from "jwt-decode";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (authToken, { rejectWithValue }) => {
    try {
      const { userId } = jwtDecode(authToken);
      const response = await getProfile(userId);

      return response?.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// **Update Profile Thunk**
export const updateProfileThunk = createAsyncThunk(
  "profile/updateProfile",
  async ({ authToken, updatedData }, { rejectWithValue }) => {
    try {
      const { userId } = jwtDecode(authToken);
      const response = await updateProfile(userId, updatedData);

      if (response?.data?.success) {
        return response.data.data.profile;
      } else {
        return rejectWithValue(
          response?.data?.message || "Failed to update profile"
        );
      }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  profile: {},
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      // Handle Update Profile
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload }; // Merge updated fields
        state.loading = false;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const {
  setProfile,
  updateProfilePicture,
  updateProfileField,
  resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
