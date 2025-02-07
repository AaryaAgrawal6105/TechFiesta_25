const Groq = require('groq-sdk');
const { pool } = require('../config/config');
require('dotenv').config();

// Function to analyze and store feedback
async function analyzeAndStoreFeedback(data) {
  
  const { assignment, rubric, user_id, assignment_id } = data;

  if (!assignment || !rubric || !user_id || !assignment_id) {
    throw new Error('assignment, rubric, user_id, and assignment_id are required!');
  }

  const feedbackData = await fetchFeedbackFromGroqCloud(assignment, rubric);
  const { feedback, grade, marks, points } = feedbackData;

  // Store feedback in PostgreSQL
  await pool.query(
    `INSERT INTO feedback_table (user_id, assignment_id, feedback, grade, marks, points)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [user_id, assignment_id, feedback.trim(), grade, marks, points]
  );

  return {
    message: 'Feedback stored successfully!',
    feedback: feedback.trim(),
    grade,
    marks,
    points,
  };
}

// Function to get feedback from Groq Cloud
const fetchFeedbackFromGroqCloud = async (assignment, rubric) => {
  console.log('Groq API Key:', process.env);
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  if (!assignment || !rubric || typeof rubric !== 'object') {
    throw new Error('Valid assignment and rubric are required!');
  }

  const rubricArray = Object.entries(rubric).map(([criteria, weight]) => ({
    criteria,
    weight: parseFloat(weight) * 100,
  }));

  const prompt = createFeedbackPrompt(assignment, rubricArray);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert evaluator providing detailed and structured feedback. Your response MUST end with a line "TOTAL_SCORE: X" where X is the final percentage (0-100).`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1500,
    });

    const message = chatCompletion.choices?.[0]?.message;

    if (!message?.content) {
      console.error('Received empty feedback:', message);
      throw new Error('Failed to generate feedback.');
    }

    const feedback = message.content.trim();
    return processGroqResponse(feedback);
  } catch (error) {
    console.error('Error calling Groq API:', error.message);
    throw new Error('Failed to generate feedback.');
  }
};

// Function to generate the prompt for Groq
const createFeedbackPrompt = (assignment, rubricArray) => {
  return `
    Assess this response based on technical accuracy and coherence. Provide structured feedback and a final score.

    **Submitted Response:**
    ${assignment}

    **Evaluation Criteria:**
    ${rubricArray.map(criterion => `
    - ${criterion.criteria.toUpperCase()} (${criterion.weight} points):
      * Analysis and Explanation (60% of weight):
        - Logical flow and coherence
        - Proper terminology usage
        - Depth of explanation
      
      * Accuracy and Precision (40% of weight):
        - Factual correctness
        - Adherence to guidelines
        - Error minimization

      Scoring Guide:
      - 90-100: Outstanding
      - 80-89: Good with minor issues
      - 70-79: Satisfactory with some errors
      - 60-69: Needs improvement
      - Below 60: Requires significant revision
    `).join('\n')}

    **Required Feedback Format:**
    1. Detailed criterion-wise evaluation
    2. Strengths and areas for improvement
    3. Final score calculation

    Conclude your response with:
    TOTAL_SCORE: [final percentage 0-100]

    Guidelines:
    - Assign partial credit for partial correctness
    - Provide constructive improvement suggestions
    - Ensure accuracy in scoring
  `;
};

// Function to process Groq's response and extract score
const processGroqResponse = (feedback) => {
  // Extract the final score
  const scoreMatch = feedback.match(/TOTAL_SCORE:\s*(\d+(\.\d+)?)/);
  const marks = scoreMatch ? parseFloat(scoreMatch[1]) : 70; // Default to 70 if no score found

  // Remove the TOTAL_SCORE line from feedback
  const cleanFeedback = feedback.replace(/TOTAL_SCORE:.*$/, '').trim();

  // Calculate grade based on marks
  const gradeMap = [
    { min: 97, grade: 'A+' },
    { min: 93, grade: 'A' },
    { min: 90, grade: 'A-' },
    { min: 87, grade: 'B+' },
    { min: 83, grade: 'B' },
    { min: 80, grade: 'B-' },
    { min: 77, grade: 'C+' },
    { min: 73, grade: 'C' },
    { min: 70, grade: 'C-' },
    { min: 67, grade: 'D+' },
    { min: 63, grade: 'D' },
    { min: 60, grade: 'D-' },
    { min: 0, grade: 'F' }
  ];

  const selectedGrade = gradeMap.find(g => marks >= g.min) || gradeMap[gradeMap.length - 1];

  return {
    feedback: cleanFeedback,
    grade: `${selectedGrade.grade} (${marks}%)`,
    marks,
    points: marks, // Using the percentage as points for consistency
  };
};

module.exports = { analyzeAndStoreFeedback, fetchFeedbackFromGroqCloud };
