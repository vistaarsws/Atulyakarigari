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
    awbCode:{
      type: String,
      default: null,
    },
    shipRocketInvoiceNumber : {
      type: String,
      default: null,
    },
    shipRocketRoutingCode :{
      type: String,
      default: null,
    },
    courierCompanyId :{
      type: String,
      default: null,
    },
    awbCodeStatus :{
      type: String,
      default: null,
    },
    shipRocketShipmentID :{
      type: String,
      default: null,
    },

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

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

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

    paymentMethod: {
      type: String,
      enum: [
        "Credit Card",
        "PayPal",
        "Cash on Delivery",
        "UPI",
        "Bank Transfer",
      ],
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

    shiprocketOrderId: {
      type: String,
      default: null,
    },
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
    cancellationReason: {
      type: String,
      default: null,
    },
    canceledBy: {
      type: String,
      enum: ["User", "Admin"],
      default: null,
    },

    returnRequest: {
      type: Boolean,
      default: false,
    },
    returnReason: {
      type: String,
      default: null,
    },
    returnStatus: {
      type: String,
      enum: ["Requested", "Approved", "Rejected", "Completed"],
      default: null,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
