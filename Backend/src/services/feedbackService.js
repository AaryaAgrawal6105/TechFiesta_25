const { Feedback } = require('../models');
const groqCloudService = require('../utils/groqCloudService');

exports.generateFeedback = async (assignment, rubric) => {
  const feedbackData = await groqCloudService.getFeedbackFromGroqCloud(assignment, rubric);
  const feedback = await Feedback.create({
    ...feedbackData,
    generated_at: new Date()
  });
  return feedback;
};
