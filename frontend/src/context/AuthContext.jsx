import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userContext, setUserContext] = useState(false);
  console.count();

  const loginContext = (data) => {
    console.log(data.token, "ORIGINAL TOKEN");
    Cookies.set("authToken", data.token, { expires: 7 });
    setUserContext(data);
  };

  const logout = () => {
    Cookies.remove("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ userContext, setUserContext, loginContext, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
