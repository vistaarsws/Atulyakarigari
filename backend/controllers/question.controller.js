import Question from "../models/Question.js";

// User: Ask a question
export const askQuestion = async (req, res) => {
  const { question } = req.body;
  const  productId  = req.params.id;
  const userId = req.user._id;

  if (!productId || !question || question.length < 5) {
    return res.status(400).json({ success: false, message: "Product ID and valid question are required." });
  }

  const newQuestion = await Question.create({
    productId,
    userId,
    question
  });

  res.status(201).json({ success: true, message: "Question submitted!", question: newQuestion });
};

// ?? Fetch all questions for a specific product
export const getQuestionsByProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required." });
    }

    const questions = await Question.find({ productId })
      .populate("userId", "name") // Get user name
      .select("question answer answeredBy createdAt updatedAt");

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ?? Admin: Answer a question
export const answerQuestion = async (req, res) => {
  try {
    const { answer } = req.body; // Destructure `answer` from request body
    const productId = req.params.id; // Get question/product ID from route params
    const userId = req.user?._id; // Ensure `req.user` exists and get the user ID

    // Check if the answer is provided
    if (!answer) {
      return res.status(400).json({ 
        success: false, 
        message: "Answer is required." 
      });
    }

    // Find the question by ID
    const question = await Question.findById(productId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: "Question not found." 
      });
    }

    // Update the question with the answer
    question.answer = answer;
    question.answeredBy = req.user?.name || "Unknown"; // Fallback if `req.user.name` is undefined
    question.answeredAt = new Date(); // Add a timestamp for when the answer was submitted
    await question.save();

    // Respond with success and the updated question
    return res.status(200).json({ 
      success: true, 
      message: "Answer submitted successfully.", 
      question 
    });
  } catch (error) {
    // Handle server errors
    console.error("Error answering question:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again later.", 
      error: error.message 
    });
  }
};


// ?? Admin: Edit a question or answer
export const editQuestionOrAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const questionId = req.params.id;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) return res.status(404).json({ success: false, message: "Question not found." });

    res.json({ success: true, message: "Updated successfully", updatedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ?? Admin: Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Question.findByIdAndDelete(questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found." });

    res.json({ success: true, message: "Deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
