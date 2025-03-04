import express from "express";
import {
    updateProfile,
    deleteProfile,
    getProfile,
    getAllProfiles
} from "../controllers/profile.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth)

router.put("/update", updateProfile); // Update profile by ID
router.delete("/delete", deleteProfile); // Delete profile by ID
router.get("/get", getProfile)

router.use(isAdmin)

router.get("/getAll", getAllProfiles)

export default router; 