import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", // Reference to the Product model
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity cannot be less than 1"],
            },
            expectedReturnDate: {
              type: Number,
              required: true,
              min: [0, "Quantity cannot be less than 0"],
            },
        },
    ],
    total: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

export default mongoose.model("Cart", CartSchema);
