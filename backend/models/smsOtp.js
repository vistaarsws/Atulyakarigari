import mongoose from "mongoose";
import twilioSender from "../utils/twilio-sender/index.js";

const smsOtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,    // Pass the function reference, don't execute it
    expires: 300,         // 5 minutes in seconds
  },
});

async function sendVerificationSMS(phone, otp) {
  try {
    const smsResponse = await twilioSender(
      phone,
      `Your verification code is: ${otp}. Valid for 5 minutes.`
    );
  } catch (err) {
    console.log("Not able to send verification SMS");
    throw err;
  }
}

smsOtpSchema.pre("save", async function (next) {
  try {
    await sendVerificationSMS(this.phone, this.otp);
    next();
  } catch (error) {
    throw error;
  }
});

const SmsOtp = mongoose.model("SmsOtp", smsOtpSchema);
export default SmsOtp;
