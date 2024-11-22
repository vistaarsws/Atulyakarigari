import { useMemo, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ScrollToTop from "./hooks/ScrollToTop";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// Import Pages
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Categories from "./pages/categories/index";
import Blogs from "./pages/blogs/Blogs";
import Product from "./pages/product/Product";
import Artisans from "./pages/artisans/Artisans";
import BuyNow from "./pages/buy-now/index";
import PlaceOrder from "./pages/place-order";
import AuthTemplate from "./pages/auth/AuthTemplate";

import User from "./components/layout/user/User";
import Order from "./pages/user/order/Order";
import Address from "./pages/user/address/Address";
import Profile from "./pages/user/profile/Profile";
import Wishlist from "./pages/user/wishlist/Wishlist";
import Logout from "./pages/user/logout/Logout";

// Utility Functions
const getRoutesConfig = () => ({
  publicRoutes: [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/categories", element: <Categories /> },
    { path: "/blogs", element: <Blogs /> },
    { path: "/artisans", element: <Artisans /> },
    { path: "/product/:id", element: <Product /> },
    { path: "/buy-now", element: <BuyNow /> },
    { path: "/place-order", element: <PlaceOrder /> },
    { path: "/login", element: <AuthTemplate page="login" /> },
    { path: "/signup", element: <AuthTemplate page="signup" /> },
    { path: "/otp", element: <AuthTemplate page="otp" /> },
    { path: "/admin-login", element: <AuthTemplate page="admin-login" /> },
    { path: "/admin-otp", element: <AuthTemplate page="admin-otp" /> },
  ],
  protectedRoutes: [
    { path: "orders", element: <Order /> },
    { path: "address", element: <Address /> },
    { path: "profile", element: <Profile /> },
    { path: "wishlist", element: <Wishlist /> },
    { path: "logout", element: <Logout /> },
  ],
});

// Main App Component
export default function App() {
  const location = useLocation();
  const routesConfig = getRoutesConfig();
  const { isAuthenticated, login, logout } = useAuth();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const authToken = Cookies.get("authToken");
  //   setIsAuthenticated(!!authToken);
  // }, []);

  // const handleLogout = () => {
  //   Cookies.remove("authToken");
  //   setIsAuthenticated(false);
  //   navigate("/login");
  // };

  const { hide_nav, hide_footer, navWithoutSearchBar } = useMemo(() => {
    const path = location.pathname;
    const hideNavPaths = [
      "/login",
      "/signup",
      "/otp",
      "/admin-login",
      "/admin-signup",
      "/admin-otp",
    ];
    const hideFooterPaths = [
      "/buy-now",
      "/place-order",
      "/login",
      "/signup",
      "/otp",
      "/user/wishlist",
      "/user/orders",
      "/user/address",
      "/admin-login",
      "/admin-signup",
      "/admin-otp",
    ];
    const navWithoutSearchPaths = [
      "/blogs",
      "/user/orders",
      "/user/wishlist",
      "/user/address",
      "/user/profile",
      "/place-order",
      "/artisans",
      "/about",
      "/buy-now",
    ];

    return {
      hide_nav: hideNavPaths.includes(path),
      hide_footer: hideFooterPaths.includes(path),
      navWithoutSearchBar: navWithoutSearchPaths.includes(path),
    };
  }, [location.pathname]);

  return (
    <SnackbarProvider maxSnack={3}>
      <ScrollToTop />
      {!hide_nav && (
        <Navbar
          navWithoutSearchBar_list={navWithoutSearchBar}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
      )}

      <main className={`${hide_nav ? "" : "marginTop"}`}>
        <Routes>
          {/* Public Routes */}
          {routesConfig.publicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}

          {/* Protected Routes */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          >
            {routesConfig.protectedRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </main>

      {!hide_footer && <Footer />}
    </SnackbarProvider>
  );
}
