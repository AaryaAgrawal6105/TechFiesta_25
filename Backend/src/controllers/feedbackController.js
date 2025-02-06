// controllers/feedbackController.js
const { getFeedbackFromGroqCloud } = require('../services/groqCloudServices');
const { extractTextFromPdf } = require('../services/pdfService');
const { generateFeedback } = require('../services/feedbackService');

const createFeedback = async (req, res) => {
  const { assignment, rubric, user_id, assignment_id } = req.body; // Ensure user_id and assignment_id are provided
  const { pdfUrl } = assignment; // Assuming assignment contains pdfUrl to fetch

  try {
    // Extract text from the PDF in JSON format
    const pdfJsonData = await extractTextFromPdf(pdfUrl);

    // Get feedback from Groq AI (including the extracted PDF data and rubric)
    const feedbackData = await getFeedbackFromGroqCloud(pdfJsonData, rubric);
    
    // Generate feedback for storing in the database
    const feedback = await generateFeedback({
      assignment_id,
      user_id,
      rubric_id: rubric.id,  // Ensure rubric has an ID
      score: feedbackData.score,
      comments: feedbackData.comments,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFeedback };
