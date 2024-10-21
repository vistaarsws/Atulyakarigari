import { Router } from "express";
import { login, register, sendOtp } from "../controllers/auth/index.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);



export default router;