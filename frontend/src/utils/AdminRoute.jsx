import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { userContext } = useAuth();
  return userContext?.accountType === "admin" ? children : children;
  // <Navigate to="/login" replace />
};

export default AdminRoute;
