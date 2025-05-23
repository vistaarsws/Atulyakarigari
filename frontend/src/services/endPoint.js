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
  GET_SUBCATEGORY_BY_ID: BASE_URL + "/api/v1/sub-category/get/",
  GET_SUBCATEGORY_BY_CATEGORY_ID:
    BASE_URL + "/api/v1/sub-category/get-by-category",

  ANSWER_QUESTION: BASE_URL + "/api/v1/questions/answer",
  DELETE_QUESTION: BASE_URL + "/api/v1/questions/delete",
  UPDATE_QUESTION: BASE_URL + "/api/questions/edit",
  GET_ALL_QUESTION: BASE_URL + "/api/v1/questions",

  DELETE_REVIEW_AND_RATING: BASE_URL + "/api/v1/ratingAndReviews/delete",

  GET_ALL_PROFILE: BASE_URL + "/api/v1/profile/getAll",

  GET_ALL_ORDERS: BASE_URL + "/api/v1/orders/getOrders",
};

export const user_endpoints = {
  GET_PRODUCT: BASE_URL + "/api/v1/product/get",
  GET_PRODUCT_BY_ID: BASE_URL + "/api/v1/product/get/",
  CREATE_PRODUCT: BASE_URL + "/api/v1/product/create",
  UPDATE_PRODUCT: BASE_URL + "/api/v1/product/update",
  DELETE_PRODUCT: BASE_URL + "/api/v1/product/delete",

  USER_PROFILE: BASE_URL + "/api/v1/profile/get",
  USER_PROFILE_UPDATE: BASE_URL + "/api/v1/profile/update",

  USER_WISHLIST: BASE_URL + "/api/v1/wishlist/get",
  TOGGLE_WISHLIST: BASE_URL + "/api/v1/wishlist/toggle",

  USER_ADD_TO_CART: BASE_URL + "/api/v1/addToCart/add",
  USER_GET_CART: BASE_URL + "/api/v1/addToCart/get",
  REMOVE_FROM_CART: BASE_URL + "/api/v1/addToCart/remove",

  GET_CATEGORY: BASE_URL + "/api/v1/category/get",
  GET_CATEGORY_BY_ID: BASE_URL + "/api/v1/category/get/",

  CREATE_ADDRESS: BASE_URL + "/api/v1/address/create",
  GET_ADDRESS: BASE_URL + "/api/v1/address/get",
  DELETE_ADDRESS: BASE_URL + "/api/v1/address/delete",
  UPDATE_ADDRESS: BASE_URL + "/api/v1/address/update",

  GET_RATING_BY_ID: BASE_URL + "/api/v1/ratingAndReviews/getAll/",
  CREATE_OR_UPDATE_RATING: BASE_URL + "/api/v1/ratingAndReviews/createOrUpdate",
  DELETE_RATING: BASE_URL + "/api/v1/ratingAndReviews/delete",

  GET_QUESTIONS_BY_PRODUCT: BASE_URL + "/api/v1/questions/",
  CREATE_QUESTION: BASE_URL + "/api/v1/questions/",

  GET_SERVICEABILITY: BASE_URL + "/api/v1/shiprocket/getServiceability",
  CREATE_PAYMENT: BASE_URL + "/api/v1/payment/create-payment",
  VERIFY_PAYMENT: BASE_URL + "/api/v1/payment/payment-response",

  CREATE_ORDER: BASE_URL + "/api/v1/orders/create",
  GET_ORDER_BY_ID: BASE_URL + "/api/v1/orders/getOrder",
  RETURN_ORDER: BASE_URL + "/api/v1/orders/return",
  CANCEL_ORDER: BASE_URL + "/api/v1/orders/cancel",
  
};
