import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/AuthSlice";
import productReducer from "../features/ProductSlice";
import categoryReducer from "../features/CategorySlice";
import wishlistReducer from "../features/WishlistSlice";
import cartReducer from "../features/CartSlice";
import profileReducer from "../features/ProfileSlice";
import addressReducer from "../features/AddressSlice"; 
import ordersReducer from "../features/OrderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    profile: profileReducer,
    address: addressReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables the middleware in production
    }),
});

export default store;
