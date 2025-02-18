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
        name: { type: String, required: true },
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
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],

    /** Order Cost Calculation */
    totalMRP: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    donationAmount: {
      type: Number,
      min: [0, "Donation amount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
   

    /** Order Status */
    orderStatus: {
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
      enum: ["Standard", "Express", "Overnight"],
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
      default: null,
    },

    /** Shiprocket Order Details */
    shiprocketOrderId: {
      type: String, // Order ID returned by Shiprocket
      default: null,
    },
    trackingId: {
      type: String, // Tracking ID provided by Shiprocket
      default: null,
    },
    courierName: {
      type: String, // Courier name assigned by Shiprocket
      default: null,
    },
    estimatedDelivery: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },

    /** Additional Info */
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Auto-creates createdAt & updatedAt fields
  }
);

export default mongoose.model("Order", OrderSchema);
