const axios = require('axios');
require('dotenv').config();

const GROQ_CLOUD_API_URL = 'https://api.groq.cloud/v1/chat/completions'; // Replace with actual API URL
const API_KEY = process.env.GROQ_CLOUD_API_KEY;

exports.getFeedbackFromGroqCloud = async (assignment, rubric) => {
  try {
    const response = await axios.post(
      GROQ_CLOUD_API_URL,
      { assignment, rubric },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response from GroqCloud:', {
        status: error.response.status,
        data: error.response.data,
      });
      throw new Error(
        `GroqCloud API responded with status ${error.response.status}: ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      console.error('No response received from GroqCloud:', error.request);
      throw new Error('No response received from GroqCloud API');
    } else {
      console.error('Error setting up request to GroqCloud:', error.message);
      throw new Error(`Error setting up request to GroqCloud: ${error.message}`);
    }
  }
};
