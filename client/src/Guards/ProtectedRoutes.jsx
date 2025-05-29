import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

export default function ProtectedRoutes() {
  const { isSigned, loading } = useContext(AuthContext);
  const { pathname } = useLocation();
  console.log(`pathName : ${pathname}`);

  console.log(isSigned);

  if (loading) {
    console.log("Is loading is true");
    return <div className="text-center p-5">Checking authentication...</div>;
  }

  if (!isSigned && (pathname === "/login" || pathname === "/signup")) {
    return <Outlet />;
      //   Outlet tells React‑Router “render whichever nested <Route> matches here
  }

  if (!isSigned) {
    return <Navigate to="/login" replace />;
    //replace ensures that the redirect doesn’t leave a “stuck” entry in the browser history (so the user can’t press “Back” to return to the protected page).
  }

  if (isSigned && (pathname === "/login" || pathname === "/signup" || pathname === "/home")) {
    console.log("I am hit line 21");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
