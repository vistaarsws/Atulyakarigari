import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"

const userSchema = new mongoose.Schema({
    googleId: String,

    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    // password: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
    accountType: {
        type: String,
        required: true,
        enum: ['customer', 'admin', 'super-admin'],
        default: 'customer'
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    token: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true
    }
)

userSchema.methods = {

    generateAuthToken: async function () {
        try {
            const userWithProfile = await this.populate('additionalDetails')

            const email = userWithProfile?.additionalDetails?.email;
            const phone = userWithProfile?.additionalDetails?.contactNumber; // Safely access email

            const payload = {
                _id: this._id,
                loginId: email ? email : phone,
                role: this.accountType,
            }
            return jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY }
            );
        } catch (error) {
            console.error("Error generating token:", error);
            throw new Error("Auth token generation failed");
        }
    },
    generateTemporaryToken: function () {
        try {
            const token = crypto.randomBytes(20).toString("hex");
            this.verificationToken = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");
            return token;
        } catch (error) {
            console.error("Error generating temporary token:", error);
            throw new Error("Temporary token generation failed");
        }
    }
};
const User = mongoose.model("User", userSchema)
export default User