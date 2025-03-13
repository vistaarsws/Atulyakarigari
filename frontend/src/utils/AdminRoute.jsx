import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import PageNotFound from "../pages/PageNotFound";


const AdminRoute = ({ children }) => {
  // Access the token from Redux
  const token = useSelector((state) => state.auth.token);

  // Helper function to check token expiration
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now(); // Compare expiration time with current time
    } catch (error) {
      return true; // Treat as expired if decoding fails
    }
  };

  // Check if the user is authenticated
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }
  if (jwtDecode(token)?.role === "customer") {
    return (
      <>
      <PageNotFound />
      </>
    );
  }

  // Render the children if authenticated
  return children;
};

export default AdminRoute;
