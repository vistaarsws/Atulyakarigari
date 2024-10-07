import { Routes, Route } from "react-router-dom";

import ScrollToTop from "./hooks/ScrollToTop";

import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/footer/Footer";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Blogs from "./pages/blogs/Blogs";
import Product from "./pages/product/Product";

import "./App.css";

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
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
