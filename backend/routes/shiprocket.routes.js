import express from "express";
import {
  getServiceability,
  getWallet,
  pickupAddress,
} from "../controllers/shiprocket.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/getServiceability", getServiceability);

router.use(auth);

router.get("/getWallet", getWallet);
router.put("/pickupAddress", pickupAddress);

export default router;
