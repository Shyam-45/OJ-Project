import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isSigned, setIsSigned] = useState(false);

    return (
    <AuthContext.Provider value={{ isSigned, setIsSigned }}>
      {children}
    </AuthContext.Provider>
  );
};