const Groq = require('groq-sdk');
const { pool } = require('../config/config');
require('dotenv').config();

// Function to evaluate and store feedback
async function evaluateAndStoreFeedback(data) {
  
  const { assignment, rubric, user_id, assignment_id } = data;

  if (!assignment || !rubric || !user_id || !assignment_id) {
    throw new Error('assignment, rubric, user_id, and assignment_id are required!');
  }

  const feedbackData = await getFeedbackFromGroqCloud(assignment, rubric);
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
const getFeedbackFromGroqCloud = async (assignment, rubric) => {
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

  const prompt = generatePrompt(assignment, rubricArray);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a rigorous mathematics professor providing detailed, constructive feedback. Your response MUST end with a line "FINAL_SCORE: X" where X is the total percentage score (0-100).`
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
const generatePrompt = (assignment, rubricArray) => {
  return `
    Evaluate this mathematical solution with precise technical analysis. Provide detailed scoring and feedback.

    **Mathematical Problem:**
    ${assignment}

    **Evaluation Framework:**
    ${rubricArray.map(criterion => `
    - ${criterion.criteria.toUpperCase()} (${criterion.weight} points):
      * Process Evaluation (60% of weight):
        - Mathematical reasoning and logic
        - Proper use of notation and terms
        - Clear step-by-step progression
        - Concept identification and application
      
      * Result Evaluation (40% of weight):
        - Computational accuracy
        - Final answer presentation

      Scoring Guidelines:
      - 90-100: Exceptional work
      - 80-89: Strong work with minor issues
      - 70-79: Good work with some mistakes
      - 60-69: Basic understanding shown
      - Below 60: Needs significant improvement
    `).join('\n')}

    **Required Feedback Structure:**
    1. For each criterion:
       - Evaluate each step of the solution
       - Assign specific point values
       - Provide improvement feedback
       - Show point calculations

    2. Overall Assessment:
       - List major strengths
       - Identify improvement areas
       - Show point calculations
       - Explain any major deductions

    After your detailed feedback, you MUST end with a line:
    FINAL_SCORE: [total percentage 0-100]

    Important scoring rules:
    - Award partial credit for correct reasoning
    - Consider all valid solution methods
    - Evaluate both process and result
    - Use precise point values
    `;
};

// Function to process Groq's response and extract score
const processGroqResponse = (feedback) => {
  // Extract the final score
  const scoreMatch = feedback.match(/FINAL_SCORE:\s*(\d+(\.\d+)?)/);
  const marks = scoreMatch ? parseFloat(scoreMatch[1]) : 70; // Default to 70 if no score found

  // Remove the FINAL_SCORE line from feedback
  const cleanFeedback = feedback.replace(/FINAL_SCORE:.*$/, '').trim();

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

module.exports = { evaluateAndStoreFeedback, getFeedbackFromGroqCloud };