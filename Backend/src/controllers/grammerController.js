const { generateGrammarFeedback, retrieveGrammarFeedback } = require('../services/grammerServices');

const createGrammarFeedback = async (req, res) => {
  const { text, rubric, user_id, submission_id } = req.body;

  if (!text || !rubric || !user_id || !submission_id) {
    return res.status(400).json({ error: 'Text, rubric, user_id, and submission_id are required!' });
  }

  try {
    const feedback = await generateGrammarFeedback(text, rubric, user_id, submission_id);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating grammar feedback:', error);
    res.status(500).json({ message: 'Failed to generate grammar feedback' });
  }
};

const getGrammarFeedback = async (req, res) => {
  const { submission_id } = req.params;

  try {
    const feedback = await retrieveGrammarFeedback(submission_id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error retrieving grammar feedback:', error);
    res.status(500).json({ message: 'Failed to retrieve feedback' });
  }
};

module.exports = { createGrammarFeedback, getGrammarFeedback };
