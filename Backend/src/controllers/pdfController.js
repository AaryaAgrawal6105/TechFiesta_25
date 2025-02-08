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

    // If no rubric provided or empty, create default with equal weights
    if (!rubric || Object.keys(rubric).length === 0) {
        const equalWeight = 1 / requiredCriteria.length;
        return requiredCriteria.reduce((acc, criterion) => {
            acc[criterion] = equalWeight;
            return acc;
        }, {});
    }

    // Parse and validate the rubric weights
    const normalizedRubric = {};
    let totalWeight = 0;

    // First pass: Parse all weights and calculate total
    requiredCriteria.forEach(criterion => {
        const weight = rubric[criterion] ? parseFloat(rubric[criterion]) : 0;
        normalizedRubric[criterion] = weight;
        totalWeight += weight;
    });

    // If total weight is 0, use equal weights
    if (totalWeight === 0) {
        const equalWeight = 1 / requiredCriteria.length;
        requiredCriteria.forEach(criterion => {
            normalizedRubric[criterion] = equalWeight;
        });
    } else {
        // Normalize weights to sum to 1
        requiredCriteria.forEach(criterion => {
            normalizedRubric[criterion] = normalizedRubric[criterion] / totalWeight;
        });
    }

    return normalizedRubric;
};

exports.convertPDFToText = async (req, res) => {
    try {
        // Check for file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No PDF file uploaded. Please upload a file with field name "pdfFile"'
            });
        }

        // Validate file type
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({
                success: false,
                message: 'Uploaded file must be a PDF'
            });
        }

        // Extract and validate required fields
        const { user_id, submission_id, type = 'grammar' } = req.body;
        
        // Parse rubric from request body
        let rubric;
        try {
            rubric = req.body.rubric ? JSON.parse(req.body.rubric) : null;
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid rubric format. Rubric must be a valid JSON string'
            });
        }

        // Validate required fields
        if (!user_id || !submission_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: user_id and submission_id are required'
            });
        }

        // Validate feedback type
        if (!ENDPOINTS[type]) {
            return res.status(400).json({
                success: false,
                message: `Invalid feedback type. Must be one of: ${Object.keys(ENDPOINTS).join(', ')}`
            });
        }

        // Convert PDF to text
        const extractedText = await pdfService.convertPDFToText(req.file);

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No text content could be extracted from the PDF'
            });
        }

        // Normalize rubric
        const finalRubric = normalizeRubric(rubric, type);

        // Verify rubric weights sum to 1
        const weightSum = Object.values(finalRubric).reduce((sum, weight) => sum + weight, 0);
        if (Math.abs(weightSum - 1) > 0.0001) { // Allow for small floating-point errors
            return res.status(400).json({
                success: false,
                message: 'Rubric weights must sum to 1',
                currentSum: weightSum,
                rubric: finalRubric
            });
        }

        // Prepare feedback request data
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

        // Send request to appropriate feedback endpoint
        const response = await axios.post(ENDPOINTS[type], feedbackData);

        return res.json({
            success: true,
            data: {
                originalText: extractedText,
                feedback: response.data,
                normalizedRubric: finalRubric
            }
        });

    } catch (error) {
        console.error('Error in convertPDFToText:', error);
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: 'Error processing request',
            error: error.response?.data || error.message
        });
    }
};