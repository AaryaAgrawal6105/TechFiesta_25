// controllers/pdfController.js
const pdfService = require('../services/pdfService');

exports.convertPDFToText = async (req, res) => {
    try {
        // Check if file exists in request
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Pass the entire file object to the service
        // Use pdfService.convertPDFToText instead of just convertPDFToText
        const extractedText = await pdfService.convertPDFToText(req.file);
        return res.json({ text: extractedText });
    } catch (error) {
        console.error('Error in convertPDFToText:', error);
        return res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};