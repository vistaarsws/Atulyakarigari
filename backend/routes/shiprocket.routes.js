import express from "express";
import {
  getServiceability,
  getWallet,
  pickupAddress,
  getAllPickupLocations,
  trackPackage,
  getAllDeliveryAssociatePartner,
  assignDeliveryPartnerToOrder,
  schedulePickupByAdmin,
  cancelShipmentByAdmin
} from "../controllers/shiprocket.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth);

router.post("/getServiceability", getServiceability);
router.get("/getWallet", getWallet);
router.put("/pickupAddress", pickupAddress);
router.get("/getPickupLocations", getAllPickupLocations);
router.get("/trackPackage",trackPackage);
router.get("/getDeliveryPartner", getAllDeliveryAssociatePartner);
router.post("/associateDeliveryPartner", assignDeliveryPartnerToOrder );
router.post("/schedulePickup", schedulePickupByAdmin);
router.delete("/cancelShipment", cancelShipmentByAdmin);

export default router;
