import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/AuthSlice";
import productReducer from "../features/ProductSlice";
import categoryReducer from "../features/CategorySlice";
import wishlistReducer from "../features/WishlistSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
