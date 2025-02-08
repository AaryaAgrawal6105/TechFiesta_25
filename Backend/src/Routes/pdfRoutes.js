const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfController = require('../controllers/pdfController');

// Configure storage for multer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if a file was actually uploaded
        if (!file) {
            cb(new Error('No file uploaded!'), false);
            return;
        }
        
        // Check file type
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
}).single('pdfFile'); // Changed field name to be more specific

// Route for converting PDF to text
router.post('/convert', (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            return res.status(400).json({
                success: false,
                message: 'File upload error: ' + err.message
            });
        } else if (err) {
            // An unknown error occurred
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        
        // If everything went fine, pass control to the controller
        pdfController.convertPDFToText(req, res, next);
    });
});

module.exports = router;