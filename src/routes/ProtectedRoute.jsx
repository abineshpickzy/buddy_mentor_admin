import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasPermission } from "@/permissions/hasPermission";

const ProtectedRoute = ({ children, permission }) => {
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;

  //  Layer 1 — Authentication
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  //  Layer 2 — Permission Check
  if (permission && !hasPermission(auth, permission)) {
    return <Navigate to="/no-access" replace />;
  }

  return children;
};

export default ProtectedRoute;
