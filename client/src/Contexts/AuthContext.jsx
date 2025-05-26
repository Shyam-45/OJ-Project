import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isSigned, setIsSigned] = useState(false);
    const [userId, setUserId] = useState("");

    return (
    <AuthContext.Provider value={{ isSigned, setIsSigned, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};