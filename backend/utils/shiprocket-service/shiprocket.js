import axios from "axios";
import { shiprocketConfig } from "../../config/shiprocket.js";
import { logMessage } from "../../utils/winston-logger/logHelper.js";
import dotenv from "dotenv";

dotenv.config();

let tokenData = {
  token: null,
  expiresAt: null,
};

export const getShiprocketToken = async () => {
  const currentTime = Date.now();

  if (tokenData.token && tokenData.expiresAt && currentTime < tokenData.expiresAt) {
    return tokenData.token;
  }

  try {
    const response = await axios.post(`${shiprocketConfig.API_BASE}/auth/login`, {
      email: shiprocketConfig.EMAIL,
      password: shiprocketConfig.PASSWORD,
    });

    if (response.status !== 200 || !response.data?.token) {
      logMessage("error", `Shiprocket Auth Error! Status: ${response.status} - ${response.statusText}`, "shiprocket-errors");
      throw new Error(`Auth error! Status: ${response.status}`);
    }

    tokenData.token = response.data.token;
    tokenData.expiresAt = currentTime + 23 * 60 * 60 * 1000;

    logMessage("info", "Shiprocket Auth Token acquired successfully", "shiprocket-info");
    return tokenData.token;
  } catch (error) {
    logMessage("error", `Shiprocket Auth Error: ${error?.message || "Unknown error"}`, "shiprocket-errors");
    return null;
  }
};


export const addProductToShiprocket = async (product) => {
  const authToken = await getShiprocketToken();

  const payload = {
    name: product.name,
    category_code: product.category_code || "default",
    type: product.type || "Single", 
    sku: product.sku, 
    qty: product.stock.toString(), 
    price: product.price,
    hsn_code: product.hsn_code || "",
    weight: product.weight || 0.5,
    length: product.length || 10,
    breadth: product.breadth || 10,
    height: product.height || 10,
    // qc_details: {
    //   product_image: product.product_image || "",
    //   brand: product.brand || "",
    //   color: product.color || "",
    //   size: product.size || "",
    //   ean_barcode: product.ean_barcode || "",
    //   check_damaged_product: product.check_damaged_product ?? false, // Default to false
    // },
  };

  try {
    const response = await axios.post(`${shiprocketConfig.API_BASE}/products`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    logMessage("info", `Product added successfully: ${JSON.stringify(response.data)}`, "shiprocket-info");
    return response.data;
  } catch (error) {
    logMessage("error", `Error adding product: ${error?.response?.data || error.message}`, "shiprocket-errors");
    throw error;
  }
};


export const deleteProductFromShiprocket = async (sku) => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.delete(`${shiprocketConfig.API_BASE}/products/delete/${sku}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    logMessage("info", `Product deleted: ${JSON.stringify(response.data)}`, "shiprocket-info");
    return response.data;
  } catch (error) {
    logMessage("error", `Error deleting product: ${error?.response?.data || error.message}`, "shiprocket-errors");
    throw error;
  }
};

export const updateProductInShiprocket = async (product) => {
  const authToken = await getShiprocketToken();

  const payload = {
    name: product.name,
    sku: product.sku,
    price: product.price,
    stock: product.stock,
    weight: product.weight,
    length: product.length,
    breadth: product.breadth,
    height: product.height,
  };

  try {
    const response = await axios.put(`${shiprocketConfig.API_BASE}/products/update`, payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    logMessage("info", `Product updated: ${JSON.stringify(response.data)}`, "shiprocket-info");
    return response.data;
  } catch (error) {
    logMessage("error", `Error updating product: ${error?.response?.data || error.message}`, "shiprocket-errors");
    throw error;
  }
};


export const getAllProductsShipRocket = async () => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.get(`${shiprocketConfig.API_BASE}/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    logMessage("info", `Get Products successfully: ${JSON.stringify(response.data)}`, "shiprocket-info");
    return response.data;
  } catch (error) {
    logMessage("error", `Error getting products: ${error?.response?.data || error.message}`, "shiprocket-errors");
    throw error;
  }
};
