import { Router } from "express";
import { login, register, sendOtp, validateOtp } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", validateOtp)
router.post("/send-otp", sendOtp);



export default router;