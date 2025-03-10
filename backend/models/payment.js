import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentOrderId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      }
    ],
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "CANCELED"],
      default: "PENDING",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

// Updating the index for `productIds`
paymentSchema.index({ userId: 1, productIds: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
