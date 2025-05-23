import axios from "axios";
import { shiprocketConfig } from "../../config/shiprocket.js";
import { logMessage } from "../../utils/winston-logger/logHelper.js";
import dotenv from "dotenv";

dotenv.config();

let tokenData = {
  token: null,
  expiresAt: null,
};

// GET SHIPROCKET AUTHNTICATION TOKEN SHIPROCKET
const getShiprocketToken = async () => {
  const currentTime = Date.now();

  if (
    tokenData.token &&
    tokenData.expiresAt &&
    currentTime < tokenData.expiresAt
  ) {
    return tokenData.token;
  }

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/auth/login`,
      {
        email: shiprocketConfig.EMAIL,
        password: shiprocketConfig.PASSWORD,
      }
    );

    if (response.status !== 200 || !response.data?.token) {
      logMessage(
        "error",
        `Shiprocket Auth Error! Status: ${response.status} - ${response.statusText}`,
        "shiprocket-errors"
      );
      throw new Error(`Auth error! Status: ${response.status}`);
    }

    tokenData.token = response.data.token;
    const expiresInSeconds = response.data.expires_in || 300; // Default to 5 minutes
    tokenData.expiresAt = Date.now() + expiresInSeconds * 1000;

    logMessage(
      "info",
      "Shiprocket Auth Token acquired successfully",
      "shiprocket-info"
    );
    return tokenData.token;
  } catch (error) {
    logMessage(
      "error",
      `Shiprocket Auth Error: ${error?.message || "Unknown error"}`,
      "shiprocket-errors"
    );
    return null;
  }
};

// LOGOUT FROM SHIPROCKET
const logoutShiprocket = async () => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // Clear the stored token after logout
    tokenData.token = null;
    tokenData.expiresAt = null;

    logMessage(
      "info",
      "Successfully logged out from Shiprocket",
      "shiprocket-info"
    );
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error logging out from Shiprocket: ${
        error?.response?.data || error.message
      }`,
      "shiprocket-errors"
    );
    throw error;
  }
};

// GET SHIPROCKET WALLET BALANCE
export const getShiprocketWalletBalance = async () => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.get(
      `${shiprocketConfig.API_BASE}/account/details/wallet-balance`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Wallet Balance fetched successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error fetching wallet balance: ${
        error?.response?.data || error.message
      }`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GET SHIPROCKET ALL ORDERS
export const getAllProductsShipRocket = async () => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.get(`${shiprocketConfig.API_BASE}/products`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    logMessage(
      "info",
      `Get Products successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error getting products: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// CREATE SHIPROCKET ORDER
export const createShiprocketOrder = async (orderData) => {
  const authToken = await getShiprocketToken();

  const payload = {
    order_id: orderData.payment.paymentOrderId,
    order_date: new Date().toISOString(),
    pickup_location: orderData.pickupAddress || "Primary",
    channel_id: orderData.channel_id || "",
    billing_customer_name: orderData.address.fullName,
    billing_address: orderData.address.address,
    billing_city: orderData.address.city,
    billing_pincode: orderData.address.pincode,
    billing_state: orderData.address.state,
    billing_country: orderData.address.country || "India",
    billing_email: orderData.email || "",
    billing_phone: orderData.address.mobileNumber,
    shipping_is_billing: orderData.shipping_is_billing ?? true,
    shipping_customer_name: orderData.address.fullName,
    shipping_address: orderData.address.address || "",
    shipping_address_2: orderData.address.address2 || "",
    shipping_city: orderData.address.city,
    shipping_pincode: orderData.address.pincode,
    shipping_country: orderData.address.country || "India",
    shipping_state: orderData.address.state,
    shipping_email: orderData.email || "",
    shipping_phone: orderData.address.mobileNumber || "",
    order_items: orderData.products.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.selling_price,
      discount: item.discount || 0,
      tax: item.tax || 0,
      length: item.length || 10,
      breadth: item.breadth || 10,
      height: item.height || 10,
      weight: item.weight || 0.5,
    })),
    payment_method: orderData.payment.paymentMethod || "Prepaid",
    sub_total: orderData.payment.amount,
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/orders/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Order created successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error creating order: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// CANCEL ORDER
export const cancelShiprocketOrder = async (orderId) => {
  const authToken = await getShiprocketToken();

  const payload = {
    order_id: orderId,
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/orders/cancel`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Order cancelled successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error cancelling order: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// RETURN ORDER
export const ReturnShiprocketOrder = async (orderData) => {
  const authToken = await getShiprocketToken();

  const payload = {
    order_id: orderData.payment,
    order_date: orderData.orderDate || new Date().toISOString().split("T")[0],
    pickup_customer_name: orderData.address.fullName,
    pickup_address: orderData.address.address,
    pickup_city: orderData.address.city,
    pickup_state: orderData.address.state,
    pickup_country: "India", // Default to India
    pickup_pincode: orderData.address.pincode,
    pickup_email: orderData.email,
    pickup_phone: orderData.address.mobileNumber,
    shipping_customer_name: orderData.address.fullName,
    shipping_address: orderData.address.address,
    shipping_city: orderData.address.city,
    shipping_state: orderData.address.state,
    shipping_country: "India",
    shipping_pincode: orderData.address.pincode,
    shipping_email: orderData.email,
    shipping_phone: orderData.address.mobileNumber,
    order_items: orderData.products.map((item) => ({
      sku: item.sku,
      name: item.name,
      units: item.units,
      selling_price: item.sellingPrice,
      length: item.length,
      breadth: item.breadth,
      height: item.height,
      weight: item.weight,
    })),
    payment_method: orderData.payment.paymentMethod || "PREPAID",
    sub_total: orderData.payment.amount,
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}orders/create/return`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Return order created successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error creating return order: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GET ALL COURIERS DETAILS
export const getShiprocketCourierListWithCounts = async (
  pickupPostcode,
  deliveryPostcode,
  cod,
  weight
) => {
  const authToken = await getShiprocketToken();

  const payload = {
    pickup_postcode: pickupPostcode,
    delivery_postcode: deliveryPostcode,
    cod: cod ? 1 : 0, // Convert boolean to 1 (true) or 0 (false)
    weight: weight || 0.5, // Default weight if not provided
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/courier/courierListWithCounts`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Courier list fetched successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error fetching courier list: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// ADD NEW PICKUP LOCATION
export const addShiprocketPickupLocation = async (pickupData) => {
  const authToken = await getShiprocketToken();

  const payload = {
    pickup_location: pickupData.pickup_location,
    name: pickupData.name,
    email: pickupData.email || "",
    phone: pickupData.phone,
    address: pickupData.address,
    address_2: pickupData.address_2 || "",
    city: pickupData.city,
    state: pickupData.state,
    country: pickupData.country || "India",
    pin_code: pickupData.pin_code,
    lat: pickupData.lat || "",
    long: pickupData.long || "",
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/settings/company/addpickup`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Pickup location added successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error adding pickup location: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GET PICKUP LOCATION
export const getShiprocketPickupLocations = async () => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.get(
      `${shiprocketConfig.API_BASE}/settings/company/pickup`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Pickup locations fetched successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error fetching pickup locations: ${
        error?.response?.data || error.message
      }`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GET PINCODE SERVICEABILITY
export const getShiprocketDeliveryEstimate = async (
  pickupPostcode,
  deliveryPostcode,
  cod,
  weight
) => {
  const authToken = await getShiprocketToken();

  if (!authToken) {
    throw new Error("Failed to retrieve Shiprocket authentication token.");
  }

  try {
    const url = `${
      shiprocketConfig.API_BASE
    }/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&cod=${
      cod ? 1 : 0
    }&weight=${weight || 0.5}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    logMessage(
      "info",
      `Serviceability check successful: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error checking serviceability: ${
        error?.response?.data || error.message
      }`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GET ALL SHIPMENT
export const getAllShiprocketShipments = async () => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.get(`${shiprocketConfig.API_BASE}/shipments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    logMessage(
      "info",
      `Shipments fetched successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error fetching shipments: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GENERATE MANIFEST
export const generateShiprocketManifest = async (shipmentIds) => {
  const authToken = await getShiprocketToken();

  const payload = {
    shipment_id: shipmentIds, // Array of shipment IDs
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/manifests/generate`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Manifest generated successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error generating manifest: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// PRINT MENIFEST
export const printShiprocketManifest = async (shipmentIds) => {
  const authToken = await getShiprocketToken();

  const payload = {
    shipment_id: shipmentIds, // Array of shipment IDs
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/manifests/print`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Manifest print URL fetched successfully: ${JSON.stringify(
        response.data
      )}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error fetching manifest print URL: ${
        error?.response?.data || error.message
      }`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GENERATE LABEL
export const generateShiprocketLabel = async (shipmentIds) => {
  const authToken = await getShiprocketToken();

  const payload = {
    shipment_id: shipmentIds, // Array of shipment IDs
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/courier/generate/label`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Shipping label generated successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error generating shipping label: ${
        error?.response?.data || error.message
      }`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GENERATE INVOICE
export const printShiprocketInvoice = async (orderIds) => {
  const authToken = await getShiprocketToken();

  const payload = {
    order_id: orderIds, // Array of order IDs
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/orders/print/invoice`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Invoice generated successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error generating invoice: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GET ACCOUNT STATEMENT
export const getShiprocketAccountStatement = async (fromDate, toDate) => {
  const authToken = await getShiprocketToken();

  const payload = {
    from_date: fromDate,
    to_date: toDate,
  };

  try {
    const response = await axios.post(
      `${shiprocketConfig.API_BASE}/account/details/statement`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Account statement fetched successfully: ${JSON.stringify(
        response.data
      )}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error fetching account statement: ${
        error?.response?.data || error.message
      }`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};

// GET SPECIFIC ORDER DETAIL
export const getShiprocketOrderDetails = async (orderId) => {
  const authToken = await getShiprocketToken();

  try {
    const response = await axios.get(
      `${shiprocketConfig.API_BASE}/orders/show?order_id=${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logMessage(
      "info",
      `Order details fetched successfully: ${JSON.stringify(response.data)}`,
      "shiprocket-info"
    );
    await logoutShiprocket();
    return response.data;
  } catch (error) {
    logMessage(
      "error",
      `Error fetching order details: ${error?.response?.data || error.message}`,
      "shiprocket-errors"
    );
    await logoutShiprocket();
    throw error;
  }
};
