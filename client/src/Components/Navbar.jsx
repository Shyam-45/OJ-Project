import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { checkLogin, logoutUser } from "../Services/auth";
import { useContext } from "react";

export default function Navbar() {
  const {isSigned, setIsSigned} = useContext(AuthContext);

  useEffect(() => {
    async function loggedStatus(){
      const status =  (await checkLogin()).loggedIn;
      setIsSigned(status);
    }
    loggedStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setIsSigned(false);
    }
    catch (err) {
      console.log("error while log out");
    }
  }

  return (
    <nav className="bg-white border-b p-4 flex justify-between">
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/home" className="hover:text-blue-600">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="#" className="hover:text-blue-600">
            Profile
          </NavLink>
        </li>
      </ul>

      {/* Auth links */}
      <div className="flex space-x-4">
        {!isSigned ? (
          <>          
            <Link
              to="/login"
              // onClick={handleSignin}
              className="text-gray-900 hover:text-blue-600"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-gray-900 hover:text-blue-600"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleSignOut}
            className="text-gray-900 hover:text-blue-600"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
