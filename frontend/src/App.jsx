import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./hooks/ScrollToTop";
import "./App.css";

import { useLocation } from "react-router-dom";

import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Categories from "./pages/categories/index";
import Blogs from "./pages/blogs/Blogs";
import Product from "./pages/product/Product";

import User from "./components/layout/user/User";
import Order from "./pages/user/order/Order";
import Address from "./pages/user/address/Address";
import Profile from "./pages/user/profile/Profile";
import Wishlist from "./pages/user/wishlist/Wishlist";
import Logout from "./pages/user/logout/Logout";
import Artisans from "./pages/artisans/Artisans";
import BuyNow from "./pages/buy-now/index";
import PlaceOrder from "./pages/place-order";
import AuthTemplate from "./pages/auth/authTemplate";
import { createTheme, ThemeProvider } from "@mui/material";

export default function App() {
  const location = useLocation();
  const url = location.pathname;

  const hide_nav = ["/login", "/signup/1", "/signup/2", "/otp"].includes(url);

  const hide_footer = [
    "/buy-now",
    "/user/profile",
    "/login",
    "/signup/1",
    "/signup/2",
    "/otp",
    "/user/wishlist",
    "/user/orders",
    "/user/address",
    "/place-order",
  ].includes(url);

  const navWithoutSearchBar_list = [
    "/blogs",
    "/user/orders",
    "/user/wishlist",
    "/user/address",
    "/user/profile",
    "/place-order",
  ].includes(url);

  const theme = createTheme({
    typography: { fontFamily: "Lato" },
  });

  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <header>{!hide_nav && <Navbar />}</header>
      <main
        className={`${hide_nav ? "" : "marginTop"} ${
          navWithoutSearchBar_list ? "removeExtraMargin" : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/buy-now" element={<BuyNow />} />
          <Route path="/place-order" element={<PlaceOrder />} />

          <Route path="/login" element={<AuthTemplate page={"login"} />} />
          <Route
            path="/signup/:page"
            element={<AuthTemplate page={"signup"} />}
          />
          <Route path="/otp" element={<AuthTemplate page={"otp"} />} />

          <Route path="/user" element={<User />}>
            <Route path="orders" element={<Order />} />
            <Route path="address" element={<Address />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </main>
      <footer>{!hide_footer && <Footer />}</footer>
    </ThemeProvider>
  );
}
