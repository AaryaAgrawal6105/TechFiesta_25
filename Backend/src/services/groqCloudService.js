// services/groqCloudService.js
const axios = require('axios');

exports.getFeedbackFromGroqCloud = async (pdfJsonData, rubric) => {
  try {
    // Send a request to Groq API with the extracted PDF content and rubric
    const response = await axios.post('https://groq.ai/evaluate', {
      pdfData: pdfJsonData.text,  // PDF text data extracted
      rubric: rubric,             // Rubric data for evaluation
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;  // This will include feedback from Groq
  } catch (error) {
    console.error('Error communicating with Groq:', error);
    throw new Error('Failed to get feedback from Groq');
  }
};
