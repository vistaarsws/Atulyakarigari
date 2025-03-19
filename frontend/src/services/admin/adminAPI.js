import { apiConnector, axiosInstance } from "../apiConnector";
import { admin_endpoints } from "../endPoint";

const getCategory = async () => {
  const response = await apiConnector("GET", admin_endpoints.GET_CATEGORY);

  return response;
};

const createCategory = async (name) => {
  const response = await apiConnector("POST", admin_endpoints.CREATE_CATEGORY, {
    name,
  });

  return response;
};

const deleteCategory = async (id) => {
  const response = await apiConnector(
    "DELETE",
    `${admin_endpoints.DELETE_CATEGORY}/${id}`
  );

  return response;
};

const updateCategory = async (name, id) => {
  const response = await apiConnector(
    "PUT",
    `${admin_endpoints.UPDATE_CATEGORY}/${id}`,
    {
      name,
    }
  );

  return response;
};

// ------------------------------------------------------------------------------------------------------------------------------------------------

const getSubCategory = async () => {
  const response = await apiConnector("GET", admin_endpoints.GET_SUBCATEGORY);

  return response;
};

const createSubCategory = async (name, parentCategory) => {
  const response = await apiConnector(
    "POST",
    admin_endpoints.CREATE_SUBCATEGORY,
    {
      name,
      parentCategory,
    }
  );

  return response;
};

const deleteSubCategory = async (id) => {
  const response = await apiConnector(
    "DELETE",
    `${admin_endpoints.DELETE_SUBCATEGORY}/${id}`,
    {
      id,
    }
  );

  return response;
};

const updateSubCategory = async (name, id) => {
  const response = await apiConnector(
    "PUT",
    `${admin_endpoints.UPDATE_SUBCATEGORY}/${id}`,
    {
      name,
    }
  );

  return response;
};

const getSubCategoryById = async (id) => {
  const response = await apiConnector(
    "GET",
    `${admin_endpoints.GET_SUBCATEGORY_BY_ID}${id}`
  );

  return response;
};
const getSubCategoryByCategoryId = async (id) => {
  const response = await apiConnector(
    "GET",
    `${admin_endpoints.GET_SUBCATEGORY_BY_CATEGORY_ID}/${id}`,
    {
      id,
    }
  );

  return response;
};

const getCategoryById = async (id) => {
  const response = await apiConnector(
    "GET",
    `${admin_endpoints.GET_CATEGORY_BY_ID}/${id}`,
    {
      id,
    }
  );

  return response;
};

const answerQuestion = async (answer, questionId) => {
  try {
    const response = await apiConnector(
      "PUT",
      admin_endpoints.ANSWER_QUESTION,
      { questionId, answer }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

const deleteReviewAndRating = async (id) => {
  const response = await apiConnector(
    "DELETE",
    `${admin_endpoints.DELETE_REVIEW_AND_RATING}/${id}`
  );

  return response;
};
const deleteQuestion = async (id) => {
  const response = await apiConnector(
    "DELETE",
    admin_endpoints.DELETE_QUESTION,
    id
  );

  return response;
};

const getAllQuestions = async (productId) => {
  const response = await apiConnector(
    "GET",
    `${admin_endpoints.GET_ALL_QUESTION}/${productId}`
  );

  return response;
};

const getAllProfiles = async () => {
  const response = await apiConnector("GET", admin_endpoints.GET_ALL_PROFILE);
  return response;
};

const getAllOrders = async () => {
  const response = await apiConnector("GET", admin_endpoints.GET_ALL_ORDERS);
  return response;
};

const addAdmin = async (email) => {
  try {
    const response = await apiConnector("POST", admin_endpoints.ADD_ADMIN, { email });
    return response;
  } catch (error) {
    console.error("Error adding admin:", error);
    return { success: false, error: error.message };
  }
};

const removeAdmin = async (email) => {
  try {
    const response = await apiConnector("POST", admin_endpoints.REMOVE_ADMIN, { email });
    return response;
  } catch (error) {
    console.error("Error removing admin:", error);
    return { success: false, error: error.message };
  }
};

const getWallet = async ()=>{
  try {
    const response = await apiConnector("GET", admin_endpoints.GET_WALLET)
    return response
  } catch (error) {
    console.error(error.message);
  }
}

export {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategory,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoryById,
  getSubCategoryByCategoryId,
  getCategoryById,
  answerQuestion,
  deleteReviewAndRating,
  deleteQuestion,
  getAllQuestions,
  getAllProfiles,
  getAllOrders,
  addAdmin,
  removeAdmin,
  getWallet,
};
