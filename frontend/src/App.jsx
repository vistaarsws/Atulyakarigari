import { useMemo, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ScrollToTop from "./hooks/ScrollToTop";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { initializeMetaPixel } from "./utils/pixel/metaPixel";
import { initializeAnalytics } from "./utils/analytics/analytics";
import TrackPageView from "./utils/analytics/TrackPageView"; // Import the tracking component
import "./App.css";

// Import Pages
import Navbar from "./components/layout/user/navbar/Navbar";
import Footer from "./components/layout/user/footer/Footer";

import Home from "./pages/user/home/Home";
import About from "./pages/user/about/About";
import Categories from "./pages/user/categories/index";
import Blogs from "./pages/user/blogs/Blogs";
import Product from "./pages/user/product/Product";
import Artisans from "./pages/user/artisans/Artisans";
import BuyNow from "./pages/user/buy-now/index";
import PlaceOrder from "./pages/user/place-order";
import AuthTemplate from "./pages/auth/AuthTemplate";

import UserProfile from "./components/layout/user/UserProfile/UserProfile";
import Order from "./pages/user/profile/order/Order";
import Address from "./pages/user/profile/address/Address";
import Profile from "./pages/user/profile/profile/Profile";
import Wishlist from "./pages/user/profile/wishlist/Wishlist";
import Logout from "./pages/user/profile/logout/Logout";
import Admin from "./pages/admin/Admin";
import AdminRoute from "./utils/AdminRoute";

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
  ],
  protectedRoutes: [
    { path: "orders", element: <Order /> },
    { path: "address", element: <Address /> },
    { path: "profile", element: <Profile /> },
    { path: "wishlist", element: <Wishlist /> },
    { path: "logout", element: <Logout /> },
  ],
  adminRoutes: [{ path: "dashboard", element: <Admin /> }],
});

// Main App Component
export default function App() {
  const location = useLocation();
  const routesConfig = getRoutesConfig();
  const { userContext } = useAuth();

  useEffect(() => {
    initializeAnalytics();
     
    initializeMetaPixel(import.meta.env.VITE_PIXEL_ID);
  }, []);

  console.log("userContext", userContext?.accountType);

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

    return {
      hide_nav: hideNavBar.includes(path),
      hide_footer: hideFooter.includes(path),
      navWithoutSearchBar: navWithoutSearchBar.includes(path),
    };
  }, [location.pathname]);

  return (
    <SnackbarProvider maxSnack={3}>
      <ScrollToTop />
      <TrackPageView /> {/* Track page views on route changes */}
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
                <UserProfile />
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
