const { fetchFeedbackFromGroqCloud } = require('../utils/codegrogCLoudService'); 
const { Feedback } = require('../models');

const analyzeAndStoreCodeFeedback = async (codeSubmission, rubric, userId, submissionId) => {
  try {
    // Fetch feedback from GroqCloud
    const feedbackData = await fetchFeedbackFromGroqCloud(codeSubmission, rubric);

    // Store feedback in Feedback model
    const feedback = await Feedback.create({
      submission_id: submissionId,
      user_id: userId,
      rubric_id: rubric.id,
      score: feedbackData.points,
      comments: feedbackData.feedback,
      generated_at: new Date(),
    });

    return feedback;
  } catch (error) {
    console.error('Error generating code feedback:', error);
    throw new Error('Failed to generate code feedback');
  }
};

const retrieveCodeFeedback = async (submission_id) => {
  try {
    const feedback = await Feedback.findOne({ where: { submission_id } });
    return feedback;
  } catch (error) {
    console.error('Error retrieving code feedback:', error);
    throw error;
  }
};

module.exports = { analyzeAndStoreCodeFeedback, retrieveCodeFeedback };
