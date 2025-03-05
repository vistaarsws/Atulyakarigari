import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

export const authSlice = createSlice({
  name: "auth",
  initialState: { token: token ? token : null },
  reducers: {
    login: (state, action) => {
      Cookies.set("authToken", action.payload, { expires: 7 });
      state.token = action.payload;
    },

    logout: (state) => {
      Cookies.remove("authToken");
      state.token = null;
      window.location.reload();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
