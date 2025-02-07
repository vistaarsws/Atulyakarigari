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
router.get("/:id", getQuestionsByProduct);

router.use(auth);
router.use(isAdmin);

router.put("/answer/:id", answerQuestion);
router.put("/edit", editQuestionOrAnswer);
router.delete("/", deleteQuestion);

export default router;
