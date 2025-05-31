import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { logoutUser } from "../Services/user";

export default function Navbar() {
  const { setIsSigned, userId, setUserId } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutErr, setLogoutErr] = useState("");

  const handleSignOut = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        setUserId("");
        setIsSigned(false);
        setLogoutErr("");
        setMobileOpen(false);
        return;
      }
      setLogoutErr(response.error);
    } catch (err) {
      console.error("Error while logging out", err);
      setLogoutErr("Logout failed. Please try again");
    }
  };

  return (
    // fixed top-0 w-full
    <div className="bg-white dark:bg-gray-600">
      <nav className="fixed top-0 w-full lg:h-16 flex flex-col lg:flex-row items-center justify-between py-4 border-2 dark:border-black bg-white lg:rounded-full dark:bg-gray-900">
        <div className="flex items-center justify-between w-full lg:basis-1/2 pl-10">
          <NavLink
            to="/"
            className="text-xl lg:text-2xl  text-gray-900 dark:text-white w-3/5"
          >
            myOnlineJudge
          </NavLink>
          <div className="flex lg:justify-center justify-between items-center w-2/5 lg:w-1/5">
            <button className=" dark:text-white text-xl">theme</button>
            {/* <div className="light_toggle dark:text-white text-xl" onClick={toggleTheme}>theme</div> */}
            <button
              className="lg:hidden dark:text-white text-xl p-2 focus:outline-none"
              onClick={() => setMobileOpen((o) => !o)}
            >
              ☰
            </button>
          </div>
        </div>

        <div
          className={`${
            mobileOpen ? "flex" : "hidden"
          } lg:flex flex-col lg:flex-row items-center justify-between basis-1/2 pr-10`}
        >
          <NavLink
            className="px-4 text-xl mx-4 pt-2 pb-1 lg:py-1 text-gray-900 text-nowrap rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            to="/"
            onClick={() => setMobileOpen((o) => !o)}
          >
            Home
          </NavLink>

          <NavLink
            className="px-4 text-xl mx-4 py-1 text-gray-900 text-nowrap rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            to="/problem"
            onClick={() => setMobileOpen((o) => !o)}
          >
            Problems
          </NavLink>
          <NavLink
            className="px-4 text-xl mx-4 py-1 text-nowrap text-gray-900 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            to="#"
            onClick={() => setMobileOpen((o) => !o)}
          >
            Compiler
          </NavLink>
          <NavLink
            className="px-4 text-xl mx-4 py-1 text-nowrap text-gray-900 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            to={`/user/${userId}`}
            onClick={() => setMobileOpen((o) => !o)}
          >
            Profile
          </NavLink>
          <NavLink
            className="px-4 text-xl mx-4 py-1 text-nowrap rounded-full text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            onClick={handleSignOut}
          >
            Log Out
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
