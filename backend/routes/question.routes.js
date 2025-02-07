import express from "express";
import {
  askQuestion,
  answerQuestion,
  editQuestionOrAnswer,
  deleteQuestion,
  getQuestionsByProduct,
} from "../controllers/question.controller.js";
import { auth, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:id", auth, askQuestion);
router.put("/answer", isAdmin, answerQuestion);
router.put("/edit", isAdmin, editQuestionOrAnswer);
router.delete("/", isAdmin, deleteQuestion);
router.get("/:id", getQuestionsByProduct);

export default router;
