import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import cookie.js library

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for the token when the app loads
    const token = Cookies.get("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // Only run on component mount

  const login = (token) => {
    Cookies.set("authToken", token, { expires: 7 }); // Set token with expiration
    setIsAuthenticated(true); // Immediately update the state after setting token
  };

  const logout = () => {
    Cookies.remove("authToken"); // Remove token
    setIsAuthenticated(false); // Immediately update the state after removing token
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
