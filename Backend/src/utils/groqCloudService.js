const axios = require('axios');

exports.getFeedbackFromGroqCloud = async (assignment, rubric) => {
  try {
    const response = await axios.post('https://groqcloud.api.endpoint', {
      assignment,
      rubric
    });
    return response.data;
  } catch (error) {
    throw new Error('Error connecting to GroqCloud');
  }
};
