import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },
    answer: { type: String, trim: true, default: "" },
    answeredBy: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

questionSchema.index({ productId: 1 }); // Fast lookup by product

export default mongoose.model("Question", questionSchema);
