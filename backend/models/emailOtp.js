import mongoose from "mongoose";
import "dotenv/config";
import sendEmail from "../utils/mail-sender/index.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    }
});

async function sendVerificationEmail(email, otp) {
    try {
        await sendEmail(email, "OTP Verification - Atulya Karigiri", "otpTemplate", { user: { name: "User" }, otp, frontendUrl: FRONTEND_URL });
        console.log(`Verification email sent successfully to ${email}`);
    } catch (err) {
        console.error("Failed to send verification email:", err);
        throw err;
    }
}

otpSchema.pre("save", async function (next) {
    try {
        await sendVerificationEmail(this.email, this.otp);
        next();
    } catch (error) {
        console.error("Error in OTP email sending middleware:", error);
        throw error;
    }
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
