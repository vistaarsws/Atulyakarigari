import { apiConnector } from "../apiConnector";
import { user_endpoints } from "../endPoint";

const createProduct = async (productObj) => {
  const response = await apiConnector(
    "POST",
    user_endpoints.CREATE_PRODUCT,
    productObj
  );
  return response;
};

const getProducts = async () => {
  const response = await apiConnector("GET", user_endpoints.GET_PRODUCT);
  return response;
};
const getProfile = async () => {
  const response = await apiConnector("GET", user_endpoints.USER_PROFILE);
  return response;
};
const updateProfile = async (_id, updatedData) => {
  const response = await apiConnector(
    "PUT",
    user_endpoints.USER_PROFILE_UPDATE,
    updatedData
  );
  return response;
};

const getUserWishlist = async () => {
  const response = await apiConnector("GET", user_endpoints.USER_WISHLIST);
  return response;
};

export { createProduct, getProducts, getProfile, updateProfile, getUserWishlist };
