import { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { checkLogin, logoutUser } from "../Services/auth";

export default function Navbar() {
  const { isSigned, setIsSigned } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function loggedStatus() {
      const status = (await checkLogin()).loggedIn;
      setIsSigned(status);
    }
    loggedStatus();
  }, [setIsSigned]);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setIsSigned(false);
      setMobileOpen(false);
    } catch (err) {
      console.error("Error while logging out", err);
    }
  };

  const links = (
    <>
      <NavLink
        to="/home"
        className="block px-3 py-2 rounded hover:bg-gray-100"
        onClick={() => setMobileOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="#"
        className="block px-3 py-2 rounded hover:bg-gray-100"
        onClick={() => setMobileOpen(false)}
      >
        Profile
      </NavLink>
      {!isSigned ? (
        <>
          <Link
            to="/login"
            className="block px-3 py-2 rounded hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="block px-3 py-2 rounded hover:bg-gray-100"
            onClick={() => setMobileOpen(false)}
          >
            Sign Up
          </Link>
        </>
      ) : (
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Sign Out
        </button>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
      
        <div className="text-2xl font-bold">myOnlineJudge</div>

        <div className="hidden md:flex md:space-x-4">
          {links}
        </div>

        <button
          className="md:hidden text-2xl p-2 focus:outline-none"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>


      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {links}
          </div>
        </div>
      )}
    </nav>
  );
}
