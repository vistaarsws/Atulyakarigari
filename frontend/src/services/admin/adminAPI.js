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

const deleteCategory = async (name) => {
  const response = await apiConnector(
    "DELETE",
    admin_endpoints.DELETE_CATEGORY,
    {
      name,
    }
  );

  return response;
};

const updateCategory = async (name) => {
  const response = await apiConnector("PUT", admin_endpoints.UPDATE_CATEGORY, {
    id,
    name,
  });

  return response;
};

// ------------------------------------------------------------------------------------------------------------------------------------------------

const getSubCategory = async (name) => {
  const response = await apiConnector(
    "GET",
    admin_endpoints.CREATE_SUBCATEGORY,
    {
      name,
    }
  );

  return response;
};

const createSubCategory = async (name) => {
  const response = await apiConnector(
    "POST",
    admin_endpoints.CREATE_SUBCATEGORY,
    {
      name,
    }
  );

  return response;
};

const deleteSubCategory = async (name) => {
  const response = await apiConnector(
    "DELETE",
    admin_endpoints.DELETE_SUBCATEGORY,
    {
      name,
    }
  );

  return response;
};

const updateSubCategory = async (name) => {
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

export {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubCategory,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
};
