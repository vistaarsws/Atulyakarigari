import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./hooks/ScrollToTop";

import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/footer/Footer";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Blogs from "./pages/blogs/Blogs";
import Product from "./pages/product/Product";

import "./App.css";
import User from "./components/layout/user/User";
import Order from "./pages/user/order/Order";
import Address from "./pages/user/address/Address";
import Profile from "./pages/user/profile/Profile";
import Wishlist from "./pages/user/wishlist/Wishlist";
import Logout from "./pages/user/logout/Logout";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/user" element={<User />}>
            <Route path="orders" element={<Order />} />
            <Route path="address" element={<Address />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
