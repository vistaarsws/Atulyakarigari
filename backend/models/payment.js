import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentOrderId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
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

paymentSchema.index({ userId: 1, productId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
