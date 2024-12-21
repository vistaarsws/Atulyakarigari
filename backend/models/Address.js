import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    pincode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, "Please provide a valid 6-digit pincode"],
    },
    address: {
        type: String,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    typeOfAddress: {
        type: String,
        enum: ["home", "office"],
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export default mongoose.model("Address", addressSchema);
