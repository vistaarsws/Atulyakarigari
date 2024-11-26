import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { userContext } = useAuth();

  if (!userContext.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
