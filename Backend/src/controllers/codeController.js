const { analyzeAndStoreCodeFeedback, retrieveCodeFeedback } = require('../services/codeServices');

const createCodeFeedback = async (req, res) => {
    const { text, rubric, user_id, submission_id } = req.body;

    // Comprehensive input validation
    if (!text || !rubric || !user_id || !submission_id) {
        return res.status(400).json({
            error: 'Text, rubric, user_id, and submission_id are required!'
        });
    }

    // Required rubric criteria
    const requiredRubricCriteria = [
        "Code Structure",
        "Algorithm Efficiency",
        "Code Readability",
        "Error Handling",
        "Best Practices"
    ];

    // Check for missing rubric criteria
    const missingCriteria = requiredRubricCriteria.filter(
        criterion => !rubric.hasOwnProperty(criterion)
    );

    if (missingCriteria.length > 0) {
        return res.status(400).json({
            error: `Missing required rubric criteria: ${missingCriteria.join(', ')}`
        });
    }

    // Validate rubric weights
    const totalWeight = Object.values(rubric).reduce(
        (sum, weight) => sum + parseFloat(weight), 0
    );

    if (Math.abs(totalWeight - 1) > 0.01) {
        return res.status(400).json({
            error: 'Rubric weights must sum to 1'
        });
    }

    try {
        const feedback = await analyzeAndStoreCodeFeedback(
            text, rubric, user_id, submission_id
        );
        res.status(201).json(feedback);
    } catch (error) {
        console.error('Error creating code feedback:', error);
        res.status(500).json({
            message: 'Failed to generate code feedback',
            error: error.message
        });
    }
};

const getCodeFeedback = async (req, res) => {
    const { submission_id } = req.params;

    if (!submission_id) {
        return res.status(400).json({
            error: 'submission_id is required'
        });
    }

    try {
        const feedback = await retrieveCodeFeedback(submission_id);

        if (!feedback) {
            return res.status(404).json({
                message: 'Feedback not found'
            });
        }

        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error retrieving code feedback:', error);
        res.status(500).json({
            message: 'Failed to retrieve feedback',
            error: error.message
        });
    }
};

module.exports = { createCodeFeedback, getCodeFeedback };