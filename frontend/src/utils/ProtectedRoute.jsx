import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // Access the token from Redux
  const token = useSelector((state) => state.auth.token);

  // Check if the user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render the children if authenticated
  return children;
};

export default ProtectedRoute;
