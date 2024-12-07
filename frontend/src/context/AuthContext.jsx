import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie"; // Import cookie.js library

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userContext, setUserContext] = useState(false);
  console.count();

  const loginContext = (data) => {
    Cookies.set("authToken", data.token, { expires: 7 }); // Set token with expiration
    setUserContext(data); // Immediately update the state after setting token
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
