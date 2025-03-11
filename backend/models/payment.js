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
      },
    ],
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Address",
    },
    amount: { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    totalMRP: { type: Number, required: true },
    donationAmounts: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI", "NET_BANKING", "WALLET"],
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "CANCELED"],
      default: "PENDING",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, productIds: 1 });
paymentSchema.index({ userId: 1, addressId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
