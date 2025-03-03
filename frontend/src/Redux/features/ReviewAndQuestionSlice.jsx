import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllQuestions } from "../../services/admin/adminAPI";

export const fetchAllQuestions = createAsyncThunk(
  "reviews/fetchAllQuestions",
  async (productId) => {
    try {
      const response = await getAllQuestions(productId);
      return response.questions;
    } catch (error) {
      console.log(error);
    }
  }
);

const reviewAndQuestionSlice = createSlice({
  name: "reviewAndQuestion",
  initialState: {
    questions: [],
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all reviews
      .addCase(fetchAllQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewAndQuestionSlice.reducer;
