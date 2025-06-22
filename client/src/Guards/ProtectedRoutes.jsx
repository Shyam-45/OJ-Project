import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoutes() {
  const { isSigned, loading } = useContext(AuthContext);
  const { pathname } = useLocation();

  if (loading) {
    return <div className="text-center p-5">Checking authentication...</div>;
  }

  if (!isSigned && (pathname === "/login" || pathname === "/signup")) {
    return <Outlet />;
  }

  if (!isSigned) {
    return <Navigate to="/login" replace />;
  }

  if (isSigned && (pathname === "/login" || pathname === "/signup" || pathname === "/home")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
