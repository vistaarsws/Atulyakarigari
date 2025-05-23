import {
  success,
  badRequest,
  internalServerError,
  notFoundRequest,
} from "../helpers/api-response.js";
import {
  getShiprocketDeliveryEstimate,
  getShiprocketPickupLocations,
  getShiprocketWalletBalance,
} from "../utils/shiprocket-service/shiprocket.js";
import Product from "../models/product.js";

export const getServiceability = async (req, res) => {
  try {
    const { productId, delivery_postcode, cod = false } = req.body;

    const PickupDetails = await getShiprocketPickupLocations();

    const pickupPincode = PickupDetails?.data?.shipping_address[0]?.pin_code;

    const product = await Product.findById(productId);

    const productWeight = product.weight;

    if (!pickupPincode) {
      return badRequest(req, res, null, "Pickup Pincode is required");
    }
    if (!delivery_postcode) {
      return badRequest(req, res, null, "Delivery Pincode is required");
    }

    const deliveryDetails = await getShiprocketDeliveryEstimate(
      pickupPincode,
      delivery_postcode,
      cod,
      productWeight
    );

    if (!deliveryDetails || !deliveryDetails.data) {
      return internalServerError(
        req,
        res,
        null,
        "Invalid deliveryDetails from Shiprocket"
      );
    }

    const availableCouriers =
      deliveryDetails.data.available_courier_companies || [];

    if (availableCouriers.length === 0) {
      return success(
        req,
        res,
        { estimated_delivery_time: null },
        "No delivery available for this pincode."
      );
    }

    const fastestCourier = availableCouriers.reduce((fastest, current) =>
      parseInt(current.etd) < parseInt(fastest.etd) ? current : fastest
    );

    const cheapestCourier = availableCouriers.reduce((cheapest, current) =>
      current.rate < cheapest.rate ? current : cheapest
    );

    const longestCourier = availableCouriers.reduce((longest, current) =>
      parseInt(current.etd) > parseInt(longest.etd) ? current : longest
    );

    return success(
      req,
      res,
      {
        fastest_delivery: {
          courier_name: fastestCourier.courier_name,
          estimated_delivery: fastestCourier.etd,
          rate: fastestCourier.rate,
        },
        cheapest_delivery: {
          courier_name: cheapestCourier.courier_name,
          estimated_delivery: cheapestCourier.etd,
          rate: cheapestCourier.rate,
        },
        longest_delivery: {
          courier_name: longestCourier.courier_name,
          estimated_delivery: longestCourier.etd,
          rate: longestCourier.rate,
        },
        all_couriers: availableCouriers,
      },
      "✅ Delivery estimation retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching serviceability:", error);
    return internalServerError(
      req,
      res,
      error,
      "⚠️ Failed to retrieve delivery estimation"
    );
  }
};

export const getWallet = async (req, res) => {
  try {
    const walletBalence = await getShiprocketWalletBalance();
    return success(req, res, walletBalence);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return internalServerError(
      req,
      res,
      error,
      "⚠️ Failed to retrieve wallet balance"
    );
  }
};

export const pickupAddress = async (req, res) => {
  try {
    const { pickupdata } = req.body;

    const pickupAddress = await addShiprocketPickupLocation(pickupdata);
    return success(req, res, pickupAddress);
  } catch (error) {
    console.error("Error Updating Pickup Lcoation", error);
    return internalServerError(
      req,
      res,
      error,
      "⚠️ Failed to Update pickup Location"
    );
  }
};
