import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentOrderId: { type: String, required: true, unique: true },
  transactionId: { type: String, default: null },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "COMPLETED", "FAILED"], default: "PENDING" },
  paymentUrl: { type: String },
}, { timestamps: true });

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
