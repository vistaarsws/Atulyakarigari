import express from "express";
import {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();
// Create a review
router.post("/create", createReview);

// Get all reviews for a product
router.get("/getAll", getReviewsByProduct);

// Update a review
router.put("/update", updateReview);

// Delete a review
router.delete("/delete", deleteReview);

export default router;