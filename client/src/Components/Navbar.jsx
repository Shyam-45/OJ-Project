import { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { logoutUser } from "../services/user";

export default function Navbar() {
  const { setIsSigned, userId, setUserId, darkMode, setDarkMode } = useContext(AuthContext);
  const [logoutErr, setLogoutErr] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const closeMenu = (e) => {
      if (showProfileMenu && !e.target.closest(".relative")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showProfileMenu]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        setUserId("");
        setIsSigned(false);
        setLogoutErr("");
        setShowMobileMenu();
        return;
      }
      setLogoutErr(response.error);
    } catch (err) {
      console.error("Error while logging out", err);
      setLogoutErr("Logout failed. Please try again");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 px-6 py-4 flex items-center justify-between shadow-md bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center">
          <i className="fas fa-code text-3xl text-blue-600 mr-2"></i>
          <span className="text-xl font-bold mr-8 text-gray-700 dark:text-gray-300 dark:hover:text-blue-400">
            CodeMaster
          </span>
        </div>
        <button
          className="cursor-pointer whitespace-nowrap"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <i className="fas fa-sun text-xl text-yellow-400"></i>
          ) : (
            <i className="fas fa-moon text-xl text-blue-600"></i>
          )}
        </button>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden whitespace-nowrap"
        >
          <i className="fas fa-bars text-xl text-gray-700 dark:text-gray-300"></i>
        </button>
      </div>
      <div
        className={`absolute top-full left-0 right-0 md:relative md:top-auto md:flex items-center justify-between w-full transition-all duration-300 ease-in-out ${
          showMobileMenu
            ? "opacity-100 visible"
            : "opacity-0 invisible md:opacity-100 md:visible"
        } bg-white dark:bg-gray-800 md:bg-transparent`}
      >
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:py-0">
          <NavLink
            to="/"
            className="text-base font-medium hover:text-blue-600 transition-colors text-gray-700 dark:text-gray-300  dark:hover:text-blue-300"
          >
            Home
          </NavLink>
          <NavLink
            to="/problems"
            className="text-base font-medium hover:text-blue-600 transition-colors text-gray-700 dark:text-gray-300  dark:hover:text-blue-300"
          >
            Problems
          </NavLink>
          <NavLink
            to="/compiler"
            className="text-base font-medium hover:text-blue-600 transition-colors text-gray-700 dark:text-gray-300  dark:hover:text-blue-300"
          >
            Compiler
          </NavLink>
        </div>
        <div className="flex items-center justify-center space-x-6 p-4 md:p-0">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 dark:bg-blue-500">
                <i className="fas fa-user text-white"></i>
              </div>
            </button>
            {showProfileMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5`}
              >
                <NavLink
                  to={`/${userId}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <i className="fas fa-user-circle mr-2"></i>
                  <span className="text-base">View Profile</span>
                </NavLink>
                <hr className="my-1 border-gray-300" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm dark:text-red-400 dark:hover:bg-gray-600 text-red-600 hover:bg-gray-100"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  <span className="text-base">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
