const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/api/v1/auth/send-otp",
  SIGNUP_API: BASE_URL + "/api/v1/auth/register",
  LOGIN_API: BASE_URL + "/api/v1/auth/login",
  VERIFYOTP_API: BASE_URL + "/api/v1/auth/verify-otp",
};

export const admin_endpoints = {
  GET_CATEGORY: BASE_URL + "/api/v1/category/get",
  CREATE_CATEGORY: BASE_URL + "/api/v1/category/create",
  DELETE_CATEGORY: BASE_URL + "/api/v1/category/delete",
  UPDATE_CATEGORY: BASE_URL + "/api/v1/category/update",
  GET_CATEGORY_BY_ID: BASE_URL + "/api/v1/category/get",

  GET_SUBCATEGORY: BASE_URL + "/api/v1/sub-category/get",
  CREATE_SUBCATEGORY: BASE_URL + "/api/v1/sub-category/create",
  DELETE_SUBCATEGORY: BASE_URL + "/api/v1/sub-category/delete",
  UPDATE_SUBCATEGORY: BASE_URL + "/api/v1/sub-category/update",
  GET_SUBCATEGORY_BY_CATEGORY_ID:
    BASE_URL + "/api/v1/sub-category/get-by-category",
};

export const user_endpoints = {
  GET_PRODUCT: BASE_URL + "/api/v1/product/get",
  CREATE_PRODUCT: BASE_URL + "/api/v1/product/create",
  USER_PROFILE: BASE_URL + "/api/v1/profile/get",
  USER_PROFILE_UPDATE: BASE_URL + "/api/v1/profile/update",
  USER_WISHLIST: BASE_URL + "/api/v1/wishlist/get",
};
