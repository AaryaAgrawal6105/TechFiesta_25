const express = require('express');
const router = express.Router();
const multer = require('multer');

const feedbackController = require('../controllers/feedbackController');
const { createCodeFeedback, getCodeFeedback } = require('../controllers/codeController');
const { createGrammarFeedback, getGrammarFeedback } = require('../controllers/grammerController');

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Multer error handling middleware
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
            message: 'File upload error', 
            error: err.message 
        });
    } else if (err) {
        return res.status(400).json({ 
            message: 'File upload failed', 
            error: err.message 
        });
    }
    next();
};

// Route to handle feedback creation for math
router.post('/math', feedbackController.createFeedback);

// Route to generate feedback for code submission
router.post('/code', createCodeFeedback);

// Route to retrieve feedback for a given code submission
router.get('/code/:submission_id', getCodeFeedback);

// Route to create grammar feedback
router.post('/grammar-feedback', createGrammarFeedback);

// Route to get grammar feedback by assignment_id
router.get('/grammar-feedback/:assignment_id', getGrammarFeedback);

module.exports = router;