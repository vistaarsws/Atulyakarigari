import { Router } from "express";
import { backup, login, register, sendOtp, validateOtp } from "../controllers/auth.controller.js";
import { googleAuthHandler } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", validateOtp)
router.post("/send-otp", sendOtp);
router.post("/backup", backup)
router.post("/google", googleAuthHandler);


export default router;