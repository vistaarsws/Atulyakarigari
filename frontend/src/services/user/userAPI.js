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

const updateProduct = async (productId, formData) => {
  const response = await apiConnector(
    "PUT",
    `${user_endpoints.UPDATE_PRODUCT}/${productId}`,
    formData
  );
  return response;
};

const deleteProduct = async (productId) => {
  const response = await apiConnector(
    "DELETE",
    `${user_endpoints.DELETE_PRODUCT}/${productId}`
  );
  return response;
};

const getProductById = async (productId) => {
  const response = await apiConnector(
    "GET",
    user_endpoints.GET_PRODUCT_BY_ID + `${productId}`
  );
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

const toggleWishlistItem = async (productId) => {
  const response = await apiConnector("POST", user_endpoints.TOGGLE_WISHLIST, {
    productId,
  });
  return response;
};

const getcategoryById = async (id) => {
  const response = await apiConnector(
    "GET",
    user_endpoints.GET_CATEGORY_BY_ID + `${id}`
  );
  return response;
};
const getcategory = async () => {
  const response = await apiConnector("GET", user_endpoints.GET_CATEGORY);
  return response;
};
const addToCart = async (productId, quantity) => {
  const response = await apiConnector("POST", user_endpoints.USER_ADD_TO_CART, {
    productId,
    quantity,
  });
  return response;
};

const getCart = async () => {
  try {
    const response = await apiConnector("GET", user_endpoints.USER_GET_CART);
    return response;
  } catch (err) {
    console.error("Error fetching cart data:", err);
    throw err;
  }
};

const removeFromCart = async (productId) => {
  try {
    const response = await apiConnector(
      "DELETE",
      user_endpoints.REMOVE_FROM_CART,
      { productId }
    );
    return response;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const createAddress = async (addressDetails) => {
  try {
    const response = await apiConnector(
      "POST",
      user_endpoints.CREATE_ADDRESS,
      addressDetails
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAddress = async () => {
  try {
    const response = await apiConnector("GET", user_endpoints.GET_ADDRESS);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const deleteAddress = async (id) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${user_endpoints.DELETE_ADDRESS}/${id}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const updateAddress = async (id, newAddressDetails) => {
  try {
    const response = await apiConnector(
      "PUT",
      `${user_endpoints.UPDATE_ADDRESS}/${id}`,
      newAddressDetails
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getReview = async (productId) => {
  try {
    const response = await apiConnector(
      "POST", 
      user_endpoints.GET_RATING, 
      { productId } 
    );
    return response;
  } catch (error) {
    console.log("Error fetching reviews:", error);
  }
};


const createOrUpdateReview = async (id, review, comment) => {
  try {
    const response = await apiConnector(
      "PUT",
      user_endpoints.CREATEANDUPDATE_RATING,
      id,
      review, 
      comment
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const deleteReview = async (id) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${user_endpoints.DELETE_RATING}/${id}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export {
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  getProfile,
  updateProfile,
  updateProduct,
  getUserWishlist,
  toggleWishlistItem,
  getcategory,
  getcategoryById,
  addToCart,
  getCart,
  removeFromCart,
  createAddress,
  getAddress,
  deleteAddress,
  updateAddress,
  getReview,
  createOrUpdateReview,
  deleteReview,
};
