const pdfService = require('../services/pdfServices');
const axios = require('axios');

const ENDPOINTS = {
    grammar: 'http://localhost:3000/api/feedback/grammar-feedback',
    code: 'http://localhost:3000/api/feedback/code',
    math: 'http://localhost:3000/api/feedback/math'
};

const normalizeRubric = (rubric, type) => {
    const defaultRubrics = {
        grammar: ['Grammar', 'Clarity', 'Technical Accuracy', 'Cohesion and Coherence', 'Vocabulary and Word Choice'],
        code: ['Code Structure', 'Algorithm Efficiency', 'Code Readability', 'Error Handling', 'Best Practices'],
        math: ['Problem Solving', 'Mathematical Reasoning', 'Calculation Accuracy', 'Explanation and Clarity']
    };

    const requiredCriteria = defaultRubrics[type] || defaultRubrics.grammar;
    
    // If no rubric provided, create default
    if (!rubric || Object.keys(rubric).length === 0) {
        return requiredCriteria.reduce((acc, criterion) => {
            acc[criterion] = 1 / requiredCriteria.length;
            return acc;
        }, {});
    }

    // Normalize provided rubric
    const totalWeight = Object.values(rubric).reduce((sum, weight) => sum + parseFloat(weight || 1), 0);
    
    const normalizedRubric = {};
    requiredCriteria.forEach(criterion => {
        normalizedRubric[criterion] = rubric[criterion] 
            ? parseFloat(rubric[criterion]) / totalWeight 
            : 0;
    });

    return normalizedRubric;
};

exports.convertPDFToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { user_id, submission_id, rubric, type = 'grammar' } = req.body;

        if (!user_id || !submission_id) {
            return res.status(400).json({ message: 'user_id and submission_id are required' });
        }

        const extractedText = await pdfService.convertPDFToText(req.file);

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({ message: 'No text content extracted from PDF' });
        }

        const finalRubric = normalizeRubric(rubric, type);

        const feedbackData = {
            text: extractedText,
            rubric: finalRubric,
            user_id,
            submission_id,
            type,
            language: 'en',
            content: extractedText,
            metadata: {
                source: 'pdf',
                filename: req.file.originalname
            }
        };

        try {
            const response = await axios.post(ENDPOINTS[type], feedbackData);
            return res.json({
                originalText: extractedText,
                feedback: response.data,
                normalizedRubric: finalRubric
            });
        } catch (error) {
            console.error('Detailed error:', error.response?.data || error.message);
            return res.status(error.response?.status || 500).json({
                message: `Error processing ${type} feedback`,
                error: error.response?.data || error.message
            });
        }
    } catch (error) {
        console.error('Error in convertPDFToText:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};