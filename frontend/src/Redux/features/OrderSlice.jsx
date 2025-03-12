import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllOrders} from '../../services/admin/adminAPI';

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (authToken) => {
    try {
      const response = await getAllOrders(authToken);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;