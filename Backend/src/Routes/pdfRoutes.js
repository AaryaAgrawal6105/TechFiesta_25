// routes/pdfRoutes.js
const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const multer = require('multer');

// Set up multer for file upload in memory
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept PDF and DOCX files
        if (file.mimetype === 'application/pdf' || 
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed!'), false);
        }
    }
});

// Route for converting PDF to text - notice 'forms' matches Postman field name
router.post('/convert', upload.single('forms'), pdfController.convertPDFToText);

module.exports = router;