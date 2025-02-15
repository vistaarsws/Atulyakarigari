import express from "express";
import { getServiceability } from "../controllers/shiprocket.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth);

router.post("/getServiceability", getServiceability);
// router.post("/auth", getAuthToken);
// router.post("/request", handleShiprocketRequest);

export default router;
