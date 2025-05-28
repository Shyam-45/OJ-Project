import { useEffect } from "react";
import { createContext, useState } from "react";
import { checkLogin } from "../Services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSigned, setIsSigned] = useState();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loggedStatus() {
      const response = await checkLogin();
      if (!(response.loggedIn)) {
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

  // useEffect(() => {
  //   async function loggedStatus() {
  //     const status = (await checkLogin()).loggedIn;
  //     if (!status) {
  //       navigate("/login");
  //       return;
  //     }
  //     setIsSigned(status);
  //     navigate("/home");
  //   }
  //   loggedStatus();
  // }, [isSigned]);

  return (
    <AuthContext.Provider value={{ isSigned, setIsSigned, userId, setUserId, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
