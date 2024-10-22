import { Router } from "express";
import { login, registerWithEmail, registerWithPhone, sendEmailOtp, sendSmsOtp } from "../controllers/auth/index.js";

const router = Router();

router.post("/register-with-email", registerWithEmail);
router.post("/login", login);
router.post("/send-email-otp", sendEmailOtp);
router.post('/send-sms-otp', sendSmsOtp);
router.post('/register-with-phone', registerWithPhone);



export default router;