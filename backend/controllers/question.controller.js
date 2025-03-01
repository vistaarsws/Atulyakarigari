import Question from "../models/Question.js";

// User: Ask a question
export const askQuestion = async (req, res) => {
  const { question } = req.body;
  const productId = req.params.id;
  const userId = req.user._id;

  if (!productId || !question || question.length < 5) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Product ID and valid question are required.",
      });
  }

  const newQuestion = await Question.create({
    productId,
    userId,
    question,
  });

  res
    .status(201)
    .json({
      success: true,
      message: "Question submitted!",
      question: newQuestion,
    });
};

// ?? Fetch all questions for a specific product
export const getQuestionsByProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    const questions = await Question.find({ productId })
      .populate("userId", "name") // Get user name
      .select("question answer answeredBy createdAt updatedAt");

    res.json({ success: true, questions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Admin: Answer a question
export const answerQuestion = async (req, res) => {
  try {
    const { answer, questionId } = req.body;
    const adminId = req.user?._id; // Ensure admin is authenticated

    if (!answer || !questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID and answer are required.",
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Update the question with the provided answer
    question.answer = answer;
    question.answeredBy = adminId;
    await question.save();

    res.status(200).json({
      success: true,
      message: "Answer submitted successfully.",
      question,
    });
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Admin: Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required.",
      });
    }

    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    res.json({ success: true, message: "Deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
