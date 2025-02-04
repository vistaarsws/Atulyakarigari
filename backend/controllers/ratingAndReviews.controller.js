import mongoose from "mongoose";
import RatingAndReviews from "../models/ratingAndReviews.js";
import Product from "../models/product.js";
import {
    success,
    badRequest,
    internalServerError,
    notFoundRequest
} from "../helpers/api-response.js";
import Profile from "../models/profile.js";

/**
 * Add or update a review for a product.
 * A user can only leave one review per product but can update their review.
 */
export const createOrUpdateReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id; // Authenticated user's ID

        if (!userId) {
            return unauthorizedRequest(req, res, null, "User not authenticated");
        }
        
        // Validate required fields
        if (!productId || !userId || !rating || !comment) {
            return badRequest(req, res, null, "All fields are required");
        }

        // Validate productId format
        if (!mongoose.isValidObjectId(productId)) {
            return badRequest(req, res, null, "Invalid product ID format");
        }

        // Verify product existence
        const product = await Product.findById(productId);
        if (!product) {
            return notFoundRequest(req, res, null, "Product not found");
        }

        // Check if user already reviewed the product
        let review = await RatingAndReviews.findOne({ productId, userId });

        if (review) {
            // Update existing review
            review.rating = rating;
            review.comment = comment;
            review = await review.save();

            return success(req, res, "Review updated successfully", { review });
        } else {
            // Create a new review
            review = new RatingAndReviews({ productId, userId, rating, comment });
            const savedReview = await review.save();

            // Link review ID to product
            product.ratingAndReviews.push(savedReview._id);
            await product.save();

            return success(req, res, "Review added successfully", { review: savedReview });
        }
    } catch (error) {
        return internalServerError(req, res, error, "Failed to add or update review");
    }
};

/**
 * Retrieve all reviews for a specific product.
 */
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate required field
        if (!productId) {
            return badRequest(req, res, null, "Product ID is required");
        }

        // Validate productId format
        if (!mongoose.isValidObjectId(productId)) {
            return badRequest(req, res, null, "Invalid product ID format");
        }

        // Fetch reviews for the product
        const reviews = await RatingAndReviews.find({ productId });

        if (reviews.length === 0) {
            return notFoundRequest(req, res, null, "No reviews found for the product");
        }

        // Fetch user profiles for each review
        const reviewsWithUser = await Promise.all(
            reviews.map(async (review) => {
                const userProfile = await Profile.findOne({ userId: review.userId });

                return {
                    _id: review._id,
                    productId: review.productId,
                    userId: review.userId,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    userName: userProfile?.fullName ?? "Unknown User", 
                    userImage: userProfile?.profilePicture, 
                };
            })
        );

        return success(req, res, "Reviews retrieved successfully", { reviews: reviewsWithUser });
    } catch (error) {
        return internalServerError(req, res, error, "Failed to retrieve reviews");
    }
};

/**
 * Delete a specific review by ID.
 */
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user's ID
        const { id } = req.body;

        // Validate required field
        if (!id) {
            return badRequest(req, res, null, "Review ID is required");
        }

        // Validate review ID format
        if (!mongoose.isValidObjectId(id)) {
            return badRequest(req, res, null, "Invalid review ID format");
        }

        // Delete review
        const deletedReview = await RatingAndReviews.findOneAndDelete({ _id: id, userId });

        if (!deletedReview) {
            return notFoundRequest(req, res, null, "Review not found");
        }

        // Remove review ID from product
        await Product.findByIdAndUpdate(
            deletedReview.productId,
            { $pull: { ratingAndReviews: deletedReview._id } }
        );

        return success(req, res, "Review deleted successfully");
    } catch (error) {
        return internalServerError(req, res, error, "Failed to delete review");
    }
};
