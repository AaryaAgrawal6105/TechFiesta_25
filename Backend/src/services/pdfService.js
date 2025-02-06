const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const pdfParse = require('pdf-parse');
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.extractTextFromPdf = async (pdfUrl) => {
  try {
    // Fetch the PDF from Cloudinary
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const pdfData = await pdfParse(response.data);

    // Return the text in JSON format
    return {
      text: pdfData.text, // Extracted text
      numPages: pdfData.numpages, // Number of pages in the PDF
      info: pdfData.info, // PDF metadata (optional)
    };
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
