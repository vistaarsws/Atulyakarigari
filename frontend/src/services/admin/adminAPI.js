import { apiConnector } from "../apiConnector";
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
    admin_endpoints.UPDATE_SUBCATEGORY,
    {
      id,
      name,
    }
  );

  return response;
};

const getSubCategoryByCategoryId = async (id) => {
  const response = await apiConnector(
    "GET",
    admin_endpoints.GET_SUBCATEGORY_BY_CATEGORY_ID,
    {
      id,
    }
  );

  return response;
};

export {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategory,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  getSubCategoryByCategoryId,
};
