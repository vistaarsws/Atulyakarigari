import express from "express";
import {
    updateProfile,
    deleteProfile
} from "../controllers/profile.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(auth)

router.put("/update", updateProfile); // Update profile by ID
router.delete("/delete", deleteProfile); // Delete profile by ID

export default router; 