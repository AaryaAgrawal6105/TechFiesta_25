const { getFeedbackFromGroqCloud } = require('../utils/groqCloudService'); // Adjust the path if necessary
const { Feedback, Assignment } = require('../models');

const generateFeedback = async (assignment, rubric, userId, assignmentId) => {
  try {
    // Check if the assignment exists in the database
    const existingAssignment = await Assignment.findOne({ where: { id: assignmentId } });

    if (!existingAssignment) {
      throw new Error(`Assignment with ID ${assignmentId} does not exist.`);
    }

    const feedbackData = await getFeedbackFromGroqCloud(assignment, rubric);

    const feedback = await Feedback.create({
      assignment_id: assignmentId,
      user_id: userId,
      rubric_id: rubric.id,
      score: feedbackData.points,
      comments: feedbackData.feedback,
      generated_at: new Date(),
    });

    return feedback;
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
};

const retrieveFeedback = async (assignment_id) => {
  try {
    const feedback = await Feedback.findOne({ 
      where: { assignment_id },
      include: [{ model: Assignment }, { model: User }]
    });
    return feedback;
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    throw error;
  }
};

module.exports = { generateFeedback, retrieveFeedback };
