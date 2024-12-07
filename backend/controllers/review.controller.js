import Review from "../models/review.js";
import { success, badRequest, internalServerError, notFoundRequest } from "../helpers/api-response.js";

// Create a review
export const createReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;

        if (!productId || !userId || !rating || !comment) {
            return badRequest(req, res, null, "All fields are required");
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
        const { id } = req.body;
        const { rating, comment } = req.body;

        if (!id || (!rating && !comment)) {
            return badRequest(req, res, null, "Review ID and at least one field to update are required");
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
        const { id } = req.body;

        if (!id) {
            return badRequest(req, res, null, "Review ID is required");
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