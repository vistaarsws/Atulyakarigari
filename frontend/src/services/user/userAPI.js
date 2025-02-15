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

const getCart = async (id) => {
  try {
    const response = await apiConnector(
      "GET",
      user_endpoints.USER_GET_CART,
      id
    );
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

const getReviewById = async (productId) => {
  try {
    const response = await apiConnector(
      "GET",
      `${user_endpoints.GET_RATING_BY_ID}${productId}`
    );
    return response;
  } catch (error) {
    console.log("Error fetching reviews:", error);
  }
};

const createOrUpdateReview = async (productId, rating, comment) => {
  try {
    const response = await apiConnector(
      "POST",
      user_endpoints.CREATE_OR_UPDATE_RATING,
      { productId, rating, comment }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const deleteReview = async (reviewId) => {
  try {
    if (!reviewId) {
      throw new Error("Review ID is required");
    }

    const response = await apiConnector(
      "DELETE",
      `${user_endpoints.DELETE_RATING}/${reviewId}`
    );

    if (!response || response.status !== 200) {
      throw new Error("Failed to delete review");
    }

    return response.data;
  } catch (error) {
    console.error("Error in deleteReview:", error);
    throw error; // Rethrow for higher-level handling
  }
};

const getQuestionsByProduct = async (productId) => {
  try {
    const response = await apiConnector(
      "GET",
      `${user_endpoints.GET_QUESTIONS_BY_PRODUCT}${productId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const askQuestion = async (productId, question) => {
  try {
    const response = await apiConnector(
      "POST",
      `${user_endpoints.GET_QUESTIONS_BY_PRODUCT}${productId}`,
      { question }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getServiceability = async (delivery_postcode, cod) => {
  try {
    const payload = {
      delivery_postcode,
      cod,
    };

    const response = await apiConnector(
      "POST",
      user_endpoints.GET_SERVICEABILITY,
      payload
    );

    return response;
  } catch (error) {
    console.error("Error fetching serviceability:", error);
    throw error;
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
  getReviewById,
  createOrUpdateReview,
  deleteReview,
  getQuestionsByProduct,
  askQuestion,
  getServiceability,
};
