const { generateFeedback } = require('../services/feedbackService');
const { getFeedbackFromGroqCloud } = require('../utils/groqCloudService');

const createFeedback = async (req, res) => {
  const { assignment, rubric, user_id, assignment_id } = req.body; // Ensure user_id and assignment_id are provided
  try {
    const feedbackData = await getFeedbackFromGroqCloud(assignment, rubric);
    
    // Ensure necessary fields are passed
    const feedback = await generateFeedback({
      assignment_id,
      user_id,
      rubric_id: rubric.id,  // Ensure rubric has an ID
      score: feedbackData.score,
      comments: feedbackData.comments,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFeedback };
