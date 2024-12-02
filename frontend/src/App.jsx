import { useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ScrollToTop from "./hooks/ScrollToTop";

import ProtectedRoute from "./utils/ProtectedRoute";
import AdminRoute from "./utils/AdminRoute";

import Products from "./pages/admin/products/Products";
import Customers from "./pages/admin/customers/Customers";
import Orders from "./pages/admin/orders/Orders";
import Team from "./pages/admin/team/Team";
import AddNewProduct from "./pages/admin/add-new-product/AddNewProduct";

// import { useAuth } from "./context/AuthContext";
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
import Admin from "./pages/admin/Admin";

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
    // { path: "/admin-login", element: <AuthTemplate page="admin-login" /> },
    // { path: "/admin-otp", element: <AuthTemplate page="admin-otp" /> },
  ],
  protectedRoutes: [
    { path: "orders", element: <Order /> },
    { path: "address", element: <Address /> },
    { path: "profile", element: <Profile /> },
    { path: "wishlist", element: <Wishlist /> },
    { path: "logout", element: <Logout /> },
  ],
  adminRoutes: [
    { path: "products", element: <Products /> },
    { path: "add-new-product", element: <AddNewProduct /> },
    { path: "customers", element: <Customers /> },
    { path: "orders", element: <Orders /> },
    { path: "team", element: <Team /> },
    // { path: "products", element: <Admin /> },
  ],
});

// Main App Component
export default function App() {
  const location = useLocation();
  const routesConfig = getRoutesConfig();
  // const { userContext } = useAuth();

  // console.log("userContext", userContext?.accountType);

  const { hide_nav, hide_footer, navWithoutSearchBar } = useMemo(() => {
    const path = location.pathname;
    const hideNavBar = ["/login", "/signup", "/otp", "/admin"];
    const hideFooter = [
      "/buy-now",
      "/place-order",
      "/login",
      "/signup",
      "/otp",
      "/user/wishlist",
      "/user/orders",
      "/user/address",
      "/admin",
    ];

    const navWithoutSearchBar = [
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

    const shouldHideNav = hideNavBar.some((hidePath) =>
      path.startsWith(hidePath)
    );

    const shouldHideFooter = hideFooter.some((hidePath) =>
      path.startsWith(hidePath)
    );

    return {
      hide_nav: shouldHideNav,
      hide_footer: shouldHideFooter,
      navWithoutSearchBar: navWithoutSearchBar.includes(path),
    };
  }, [location.pathname]);

  return (
    <SnackbarProvider maxSnack={3}>
      <ScrollToTop />
      {!hide_nav && <Navbar navWithoutSearchBar_list={navWithoutSearchBar} />}

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

          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          >
            {routesConfig.adminRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </main>

      {!hide_footer && <Footer />}
    </SnackbarProvider>
  );
}
