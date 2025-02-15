import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    /** Shipping & Billing Details */
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
    },
    billingAddress: {
      fullName: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "India" },
    },
    shippingMethod: {
      type: String,
      default: "Standard",
    },

    /** Payment & Transaction Details */
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Cash on Delivery", "UPI", "Bank Transfer"],
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    /** Shipment Details */
    trackingId: {
      type: String,
      default: null,
    },
    courierName: {
      type: String,
      default: null,
    },
    estimatedDelivery: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },

    /** Additional Info */
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
