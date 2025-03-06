import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedAddressID: JSON.parse(localStorage.getItem("selectedAddressID")) || null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setSelectedAddressID: (state, action) => {
      state.selectedAddressID = action.payload;
      localStorage.setItem("selectedAddressID", JSON.stringify(action.payload)); // Keep localStorage in sync
    },
  },
});

export const { setSelectedAddressID } = addressSlice.actions;
export default addressSlice.reducer;
