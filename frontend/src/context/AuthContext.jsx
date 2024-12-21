// import { createContext, useContext, useState } from "react";
// import Cookies from "js-cookie";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authContext, setAuthContext] = useState(() => {
//     const token = Cookies.get("authToken");
//     return token ? token : null;
//   });

//   const loginContext = (token) => {
//     Cookies.set("authToken", token, { expires: 7 });
//     setAuthContext(token);
//   };

//   const logoutContext = () => {
//     Cookies.remove("authToken");
//     setAuthContext(null); }

//   return (
//     <AuthContext.Provider
//       value={{ authContext, setAuthContext, loginContext, logoutContext }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }
