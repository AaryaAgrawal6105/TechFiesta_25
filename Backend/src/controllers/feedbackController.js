const { generateFeedback, retrieveFeedback } = require('../services/feedbackService');
const { getFeedbackFromGroqCloud } = require('../utils/groqCloudService');

const createFeedback = async (req, res) => {
  const { assignment, rubric, user_id, assignment_id } = req.body;

  if (!assignment || !rubric || !user_id || !assignment_id) {
    return res.status(400).json({ error: 'Assignment, rubric, user_id, and assignment_id are required!' });
  }

  try {
    // Send assignment and rubric to GroqCloud to get feedback
    const groqFeedback = await getFeedbackFromGroqCloud(assignment, rubric);

    // You can now use the feedback from GroqCloud for further processing
    if (groqFeedback) {
      // Optionally, you can store this feedback in your database or use it in any other way.
      const feedback = await generateFeedback(assignment, rubric, user_id, assignment_id, groqFeedback);
      res.status(201).json(feedback);
    } else {
      res.status(500).json({ message: 'Failed to get feedback from GroqCloud' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignmentFeedback = async (req, res) => {
  const { assignment_id } = req.params;
  
  try {
    const feedback = await retrieveFeedback(assignment_id);
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ message: 'Failed to retrieve feedback' });
  }
};

module.exports = { createFeedback, getAssignmentFeedback };



