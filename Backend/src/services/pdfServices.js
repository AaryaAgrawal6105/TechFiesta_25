// services/pdfService.js
const axios = require('axios');
const FormData = require('form-data');

// Export the function directly
const convertPDFToText = async (file) => {
    const form = new FormData();
    
    // Append the file buffer with the original filename
    form.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
    });

    try {
        const response = await axios.post('http://localhost:5000/convert', form, {
            headers: {
                ...form.getHeaders(),
                'Accept': 'application/json'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        return response.data.content; // Return the extracted text content
    } catch (error) {
        console.error('Error in convertPDFToText service:', error.response?.data || error.message);
        throw new Error('Error communicating with the Python microservice');
    }
};

// Export the function as an object
module.exports = {
    convertPDFToText
};