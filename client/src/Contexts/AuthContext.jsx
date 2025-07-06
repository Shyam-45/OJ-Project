import { useEffect } from "react";
import { createContext, useState } from "react";
import { checkLogin } from "../Services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSigned, setIsSigned] = useState();
  const [userId, setUserId] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loggedStatus() {
      const response = await checkLogin();
      if (!response.loggedIn) {
        setIsSigned(false);
        setUserId("");
      } else {
        setIsSigned(true);
        setUserId(response.user_id);
      }
      setLoading(false);
      return;
    }
    loggedStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isSigned,
        setIsSigned,
        userId,
        setUserId,
        loading,
        setLoading,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
