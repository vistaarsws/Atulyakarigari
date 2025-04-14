import mongoose from "mongoose";
import {
  success,
  badRequest,
  internalServerError,
  notFoundRequest,
} from "../helpers/api-response.js";
import {
  addShiprocketPickupLocation,
  assignDeliveryPartner,
  generatePickup,
  getAllDeliveryPartner,
  getShiprocketDeliveryEstimate,
  getShiprocketPickupLocations,
  getShiprocketWalletBalance,
  trackShiprocketOrder,
} from "../utils/shiprocket-service/shiprocket.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

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
    console.log("here in getWallet");
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

export const getAllPickupLocations = async (req, res) => {
  try{
    let pickupLocations = await getShiprocketPickupLocations();
    pickupLocations = pickupLocations?.data?.shipping_address || [];
    if (!pickupLocations || pickupLocations.length === 0) {
      return notFoundRequest(req, res, null, "No pickup locations found");
    }
    return success(
      req,
      res,
      pickupLocations,
      "Pickup locations retrieved successfully"
    );
    
  }
  catch(error) {
    console.error("Error fetching pickup locations:", error);
    return internalServerError(
      req,
      res,
      error,
      "⚠️ Failed to retrieve pickup locations"
    );
  }
}

export const trackPackage = async (req,res) =>{
  try{
    let { shipmentID } = req.query;
    if(shipmentID){
      let data = await trackShiprocketOrder(shipmentID);
      return success(
        req,
        res,
        data,
        "Package tracking retrieved successfully"
      );
    }



  }
  catch(error){
    console.error("Error tracking Order :", error);
    return internalServerError(
      req,
      res,
      "⚠️ Failed to track order"
    )
  }
}


export const getAllDeliveryAssociatePartner = async (req, res) => {
  try{
    let deliveryAssociatePartner = await getAllDeliveryPartner();
    deliveryAssociatePartner = deliveryAssociatePartner || [];
    if (!deliveryAssociatePartner || deliveryAssociatePartner.length === 0) {
      return notFoundRequest(req, res, null, "No delivery associate partner found");
    }
    return success(
      req,
      res,
      deliveryAssociatePartner,
      "Delivery associate partner retrieved successfully"
    );
  }
  catch(error){
    console.error("Error fetching delivery associate partner:", error);
   
  }
}

export const assignDeliveryPartnerToOrder = async (req, res) => {
    try{
      const { orderId, deliveryPartnerId } = req.body;
      if (!orderId || !deliveryPartnerId) {
        return badRequest(req, res, null, "Order ID and Delivery Partner ID are required");
      }

      const orderDetails = await Order.findById(orderId)
      if (!orderDetails) {
        return notFoundRequest(req, res, null, "Order not found");
      }
      let shipmentData = await assignDeliveryPartner(orderDetails?.shiprocketOrderId, deliveryPartnerId)
      if (!shipmentData) {
        return notFoundRequest(req, res, null, "Shipment data not found");
      }
      
      orderDetails.awbCode = shipmentData.awb_code
      orderDetails.shipRocketInvoiceNumber = shipmentData.invoice_number
      orderDetails.shipRocketRoutingCode = shipmentData.routing_code
      orderDetails.courierCompanyId = shipmentData.courier_company_id
      orderDetails.awbCodeStatus = shipmentData.awb_code_status
      orderDetails.shipRocketShipmentID = shipmentData.shipment_id

      await orderDetails.save()

      return success(
        req,
        res,
        orderDetails,
        "Delivery partner assigned successfully"
      );


    }
    catch(error){
      console.error("Error assigning delivery partner to order:", error);
      return internalServerError(
        req,
        res,
        error,
        "⚠️ Failed to assign delivery partner to order"
      );
    }
} 


export const schedulePickupByAdmin = async (req, res) => {
  try{
    let { shipmentId, status , pickupDate } = req.body;
    if (!shipmentId) {
      return badRequest(req, res, null, "Shipment ID is are required");
    }
    let pickupData = await generatePickup(shipmentId, status, pickupDate)

    if (!pickupData) {
      return notFoundRequest(req, res, null, "Pickup data not found");
    }
    return success(
      req,
      res,
      pickupData,
      "Pickup scheduled successfully"
    );

  }
  catch(error){
    console.error("Error scheduling pickup by admin:", error);
    return internalServerError(
      req,
      res,
      error,
      "⚠️ Failed to schedule pickup by admin"
    );
  }
}


export const cancelShipmentByAdmin = async(req,res)=>{
  try{
      const {awbCode} = req.body
      if (!awbCode) {
        return badRequest(req, res, null, "AWB code is required");
      }
    let response = await cancelShipment(awbCode)
    if (!response) {
      return notFoundRequest(req, res, null, "Shipment data not found");
    }
    return success(
      req,
      res,
      response,
      "Shipment cancelled successfully"
    );
  }
  catch(error){
    console.error(error.message);
    return 
  }
}
