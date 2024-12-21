import express from "express";
import { createAddress, deleteAddress, getUserAddresses, updateAddress } from "../controllers/address.controller.js";
import { auth, isUser } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(auth)
router.use(isUser)
// Create a new address
router.post("/create", createAddress);

// Get all addresses for a user
router.get("/get", getUserAddresses);

// Update an address
router.put("/update/:id", updateAddress);

// Delete an address
router.delete("/delete/:id", deleteAddress);

export default router;
