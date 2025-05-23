import express from "express";
import {
  createOrUpdateReview,
  getReviewsByProduct,
  deleteReview
} from "../controllers/ratingAndReviews.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Routes
router.post("/createOrUpdate", createOrUpdateReview); // Handles both create and update
router.get("/getAll/:productId", getReviewsByProduct); // Retrieves all reviews for a product
router.delete("/delete/:id", deleteReview); // Deletes a review

export default router;
