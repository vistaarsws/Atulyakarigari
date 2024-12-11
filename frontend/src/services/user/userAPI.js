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
  const response = await apiConnector("POST", user_endpoints.CREATE_PRODUCT);
  return response;
};

export { createProduct, getProducts };
