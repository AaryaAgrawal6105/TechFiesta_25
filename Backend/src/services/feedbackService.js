// services/feedbackService.js
const { Feedback } = require('../models');

const generateFeedback = async (feedbackData) => {
  try {
    const feedback = await Feedback.create({
      ...feedbackData,
      generated_at: new Date(),
    });
    return feedback;
  } catch (error) {
        
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
};

module.exports = { generateFeedback };
