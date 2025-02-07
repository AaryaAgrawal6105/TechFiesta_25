const { getGrammarFeedbackFromGroqCloud } = require('../utils/grammerCloudService');
const { Feedback, User } = require('../models');

const generateGrammarFeedback = async (text, rubric, userId, submissionId) => {
  try {
    // Check if the user exists in the database
    const existingUser = await User.findOne({ where: { id: userId } });
    if (!existingUser) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    // Get grammar feedback from GroqCloud
    const feedbackData = await getGrammarFeedbackFromGroqCloud(text, rubric);

    // Store feedback in the database
    const feedback = await Feedback.create({
      submission_id: submissionId, // Changed from assignment_id
      user_id: userId,
      rubric_id: rubric.id, // Assuming rubric contains an ID
      score: feedbackData.marks,
      comments: feedbackData.feedback,
      generated_at: new Date(),
    });

    return feedback;
  } catch (error) {
    console.error('Error generating grammar feedback:', error);
    throw new Error('Failed to generate grammar feedback');
  }
};

const retrieveGrammarFeedback = async (submissionId) => {
  try {
    const feedback = await Feedback.findOne({
      where: { submission_id: submissionId }, // Changed from assignment_id
      include: [{ model: User, as: 'user' }],
    });

    return feedback;
  } catch (error) {
    console.error('Error retrieving grammar feedback:', error);
    throw error;
  }
};

module.exports = { generateGrammarFeedback, retrieveGrammarFeedback };
