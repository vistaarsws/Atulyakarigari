import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({});

const token = Cookies.get("authToken");

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("Token not found in cookies.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for handling errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error (e.g., refresh token, redirect to login, etc.)
    return Promise.reject(error);
  }
);
const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
export { apiConnector, axiosInstance };
