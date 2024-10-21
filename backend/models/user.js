import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    accountType: {
        type: String,
        required: true,
        enum: ['customer', 'admin', 'super-admin'],
        default: 'customer'
    },
    image: {
        type: String,
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

userSchema.pre("save", async function (next) {
    console.log("pass word hash");
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        console.error("Error hashing password:", error);
        next(new Error("Password hashing failed"));
    }
});

userSchema.methods = {
    comparePassword: async function (password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            console.error("Error comparing password:", error);
            throw new Error("Password comparison failed");
        }
    },
    generateAuthToken: function () {
        try {
            const payload = {
                _id: this._id,
                email: this.email,
                role: this.accountType,
            }
            return jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRY }
            );
        } catch (error) {
            console.error("Error generating token:", error);
            throw new Error("Auth token generation failed"); // Custom error message
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
            throw new Error("Temporary token generation failed"); // Custom error message
        }
    }
};
const User = mongoose.model("User", userSchema)
export default User