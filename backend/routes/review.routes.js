import express from "express";
import {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth)

router.post("/create", createReview);
router.get("/getAll", getReviewsByProduct);
router.put("/update", updateReview);
router.delete("/delete", deleteReview);

export default router;