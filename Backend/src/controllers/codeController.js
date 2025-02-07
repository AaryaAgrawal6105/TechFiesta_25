const { analyzeAndStoreCodeFeedback, retrieveCodeFeedback } = require('../services/codeServices');
const { fetchFeedbackFromGroqCloud } = require('../utils/codegrogCLoudService');

const createCodeFeedback = async (req, res) => {
  const { codeSubmission, rubric, user_id, submission_id } = req.body;

  if (!codeSubmission || !rubric || !user_id || !submission_id) {
    return res.status(400).json({ error: 'Code submission, rubric, user_id, and submission_id are required!' });
  }

  try {
    // Fetch feedback from GroqCloud
    const feedback = await analyzeAndStoreCodeFeedback(codeSubmission, rubric, user_id, submission_id);

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating code feedback:', error);
    res.status(500).json({ message: 'Failed to generate code feedback' });
  }
};

const getCodeFeedback = async (req, res) => {
  const { submission_id } = req.params;

  try {
    const feedback = await retrieveCodeFeedback(submission_id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error retrieving code feedback:', error);
    res.status(500).json({ message: 'Failed to retrieve feedback' });
  }
};

module.exports = { createCodeFeedback, getCodeFeedback };
