// RatingAndReviews Schema
import mongoose from "mongoose";

const ratingAndReviewsSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

const RatingAndReviews = mongoose.model("RatingAndReviews", ratingAndReviewsSchema);
export default RatingAndReviews;
