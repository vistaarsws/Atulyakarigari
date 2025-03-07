import { useMemo, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import { SnackbarProvider } from "notistack";
import ScrollToTop from "./hooks/ScrollToTop";
import ProtectedRoute from "./utils/ProtectedRoute";
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
import SubCategories from "./pages/user/categories/SubCategory";
import Blogs from "./pages/user/blogs/Blogs";
import Product from "./pages/user/product/Product";
import Artisans from "./pages/user/artisans/Artisans";
import ViewCart from "./pages/user/view-cart/Index";
import PlaceOrder from "./pages/user/place-order";
import OrderStatus from "./pages/user/order/OrderStatus";
import AuthTemplate from "./pages/auth/AuthTemplate";

import UserProfile from "./components/layout/user/user-profile/UserProfile";
import Order from "./pages/user/profile/order/Order";
import Address from "./pages/user/profile/address/Address";
import Profile from "./pages/user/profile/profile/Profile";
import Wishlist from "./pages/user/profile/wishlist/Wishlist";
import Logout from "./pages/user/profile/logout/Logout";
import AdminRoute from "./utils/AdminRoute";
import PageNotFound from "./pages/PageNotFound";
import AddNewProduct from "./pages/admin/add-new-product/AddNewProduct";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Customers from "./pages/admin/customers/Customers";
import Orders from "./pages/admin/orders/Orders";
import Settings from "./pages/admin/settings/Settings";
import Products from "./pages/admin/products/Products";
import Admin from "./pages/admin/Admin";
import OrderDetails from "./pages/admin/orders/OrderDetails";
import CustomerDetails from "./pages/admin/customers/CustomerDetails";
import OrderCancel from "./pages/user/order/OrderCancel";
import PaymentResponse from "./pages/user/place-order/PaymentResponse";

// Utility Functions
const getRoutesConfig = () => ({
  publicRoutes: [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/categories/:id", element: <Categories /> },
    { path: "/sub-categories/:id", element: <SubCategories /> },
    { path: "/blogs", element: <Blogs /> },
    { path: "/artisans", element: <Artisans /> },
    { path: "/product/:id", element: <Product /> },
    { path: "/view-cart", element: <ViewCart /> },
    { path: "/place-order", element: <PlaceOrder /> },
    { path: "/order-status", element: <OrderStatus /> },
    { path: "/payment-response", element: <PaymentResponse /> },
    { path: "/order-cancel", element: <OrderCancel /> },
    { path: "/login", element: <AuthTemplate page="login" /> },
    { path: "/signup", element: <AuthTemplate page="signup" /> },
    { path: "/otp", element: <AuthTemplate page="otp" /> },
  ],
  protectedRoutes: [
    { path: "", element: <Profile /> },
    { path: "orders", element: <Order /> },
    { path: "address", element: <Address /> },
    { path: "wishlist", element: <Wishlist /> },
    { path: "logout", element: <Logout /> },
  ],
  adminRoutes: [
    { path: "add-product", element: <AddNewProduct /> },
    { path: "customers", element: <Customers /> },
    { path: "customers/:id", element: <CustomerDetails /> },
    { path: "orders", element: <Orders /> },
    { path: "orders/:id", element: <OrderDetails /> },
    { path: "settings", element: <Settings /> },
    { path: "products", element: <Products /> },
  ],
});

// Main App Component
export default function App() {
  const location = useLocation();
  const routesConfig = getRoutesConfig();
  // const { userContext } = useAuth();

  useEffect(() => {
    initializeAnalytics();

    initializeMetaPixel(import.meta.env.VITE_PIXEL_ID);
  }, []);

  const { showNavBar, showFooter, navWithoutSearchBar } = useMemo(() => {
    const path = location.pathname;
    const showNavBar = [
      "/",
      "/categories",
      "/artisans",
      "/about",
      "/blogs",
      "/profile",
      "/profile/wishlist",
      "/profile/orders",
      "/profile/address",
    ];
    const showFooter = [
      // "/buy-now",
      // "/place-order",
      // "/login",
      // "/signup",
      // "/otp",
      // "/user/wishlist",
      // "/user/orders",
      // "/user/address",
      // "/admin",
      "/",
      "/categories",
      "/artisans",
      "/about",
      "/blogs",
      "/product",
    ];

    const navWithoutSearchBar = [
      "/blogs",
      "/profile",
      "/profile/orders",
      "/profile/wishlist",
      "/profile/address",
      "/place-order",
      "/artisans",
      "/about",
      "/buy-now",
    ];

    const excludedNavBarRoutes = ["/admin", "/login", "/signup", "/otp"];
    const excludedFooterRoutes = [
      "/admin",
      "/login",
      "/signup",
      "/otp",
      "/view-cart",
      "/place-order",
    ];

    return {
      showNavBar:
        showNavBar.some((route) => path.startsWith(route)) &&
        !excludedNavBarRoutes.some((excluded) => path.startsWith(excluded)),
      showFooter:
        showFooter.some((route) => path.startsWith(route)) &&
        !excludedFooterRoutes.some((exclude) => path.startsWith(exclude)),
      navWithoutSearchBar: navWithoutSearchBar.some((route) =>
        path.startsWith(route)
      ),
    };
  }, [location.pathname]);

  return (
    <SnackbarProvider maxSnack={3}>
      <ScrollToTop />
      <TrackPageView /> {/* Track page views on route changes */}
      <div>
        {showNavBar && (
          <Navbar navWithoutSearchBar_list={navWithoutSearchBar} />
        )}
        <main className={`${!showNavBar ? "" : "marginTop"} `}>
          <Routes>
            {/* Public Routes */}
            {routesConfig.publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* Protected Routes */}
            <Route
              path="/profile/*"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            >
              <Route index element={<Profile />} />
              {routesConfig.protectedRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              <Route path="*" element={<PageNotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              {routesConfig.adminRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              <Route path="*" element={<PageNotFound />} />
            </Route>

            {/* Catch-All Route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
        {showFooter && <Footer />}
      </div>
    </SnackbarProvider>
  );
}
