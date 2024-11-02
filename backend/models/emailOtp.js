import mongoose from "mongoose";
import mailSender from "../utils/mail-sender/index.js";
import emailTemplate from "../mail-template/emailVerifactionTemplate.js";
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60 // 5 minutes
    }

})

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "verification email from atulya karigiri", emailTemplate(otp))
        console.log(`successfully send verification email : - > ${mailResponse}`);
    } catch (err) {
        console.log("not able to send verification email");
        throw err
    }

}

otpSchema.pre("save", async function (next) {
    try {
        await sendVerificationEmail(this.email, this.otp)
        next()
    } catch (error) {
        throw error
    }
})

const Otp = mongoose.model("Otp", otpSchema)
export default Otp