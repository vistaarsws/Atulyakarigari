import mongoose from "mongoose"; // Import mongoose to use isValidObjectId
import Review from "../models/review.js";
import Product from "../models/product.js"; // Import the Product model
import { success, badRequest, internalServerError, notFoundRequest } from "../helpers/api-response.js";

// Create a review
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id; // Use userId from the authenticated user

        if (!productId || !userId || !rating || !comment) {
            return badRequest(req, res, null, "All fields are required");
        }

        // Validate productId format
        if (!mongoose.isValidObjectId(productId)) {
            return badRequest(req, res, null, "Invalid product ID format");
        }

        // Check if productId is valid
        const product = await Product.findById(productId);
        if (!product) {
            return notFoundRequest(req, res, null, "Product not found");
        }

        const newReview = new Review({ productId, userId, rating, comment });
        const savedReview = await newReview.save();

        return success(req, res, "Review added successfully", { review: savedReview });
    } catch (error) {
        return internalServerError(req, res, error, "Failed to add review");
    }
};

// Get all reviews for a product
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return badRequest(req, res, null, "Product ID is required");
        }

        // Validate productId format
        if (!mongoose.isValidObjectId(productId)) {
            return badRequest(req, res, null, "Invalid product ID format");
        }

        const reviews = await Review.find({ productId });

        if (reviews.length === 0) {
            return notFoundRequest(req, res, null, "No reviews found for the product");
        }

        return success(req, res, "Reviews retrieved successfully", { reviews });
    } catch (error) {
        return internalServerError(req, res, error, "Failed to retrieve reviews");
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const userId = req.user._id; // Use userId from the authenticated user
        const { id, rating, comment } = req.body;

        if (!id || (!rating && !comment)) {
            return badRequest(req, res, null, "Review ID and at least one field to update are required");
        }

        // Validate review ID format
        if (!mongoose.isValidObjectId(id)) {
            return badRequest(req, res, null, "Invalid review ID format");
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating, comment },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return notFoundRequest(req, res, null, "Review not found");
        }

        return success(req, res, "Review updated successfully", { review: updatedReview });
    } catch (error) {
        return internalServerError(req, res, error, "Failed to update review");
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user._id; // Use userId from the authenticated user
        const { id } = req.body;

        if (!id) {
            return badRequest(req, res, null, "Review ID is required");
        }

        // Validate review ID format
        if (!mongoose.isValidObjectId(id)) {
            return badRequest(req, res, null, "Invalid review ID format");
        }

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return notFoundRequest(req, res, null, "Review not found");
        }

        return success(req, res, "Review deleted successfully");
    } catch (error) {
        return internalServerError(req, res, error, "Failed to delete review");
    }
};
