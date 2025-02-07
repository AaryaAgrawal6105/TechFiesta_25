const Groq = require('groq-sdk');
const { pool } = require('../config/config');
require('dotenv').config();

// Function to evaluate and store grammar feedback
async function evaluateAndStoreGrammarFeedback(data) {
  const { text, rubric, user_id, submission_id } = data;

  if (!text || !rubric || !user_id || !submission_id) {
    throw new Error('text, rubric, user_id, and submission_id are required!');
  }

  const feedbackData = await getGrammarFeedbackFromGroqCloud(text, rubric);
  const { feedback, grade, marks, points } = feedbackData;

  // Store feedback in PostgreSQL
  await pool.query(
    `INSERT INTO grammar_feedback_table (user_id, submission_id, feedback, grade, marks, points)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [user_id, submission_id, feedback.trim(), grade, marks, points]
  );

  return {
    message: 'Grammar feedback stored successfully!',
    feedback: feedback.trim(),
    grade,
    marks,
    points,
  };
}

// Function to get grammar feedback from Groq Cloud
const getGrammarFeedbackFromGroqCloud = async (text, rubric) => {
  console.log('Groq API Key:', process.env);
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  if (!text || !rubric || typeof rubric !== 'object') {
    throw new Error('Valid text and rubric are required!');
  }

  const rubricArray = Object.entries(rubric).map(([criteria, weight]) => ({
    criteria,
    weight: parseFloat(weight) * 100,
  }));

  const prompt = generateGrammarPrompt(text, rubricArray);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a meticulous English language professor providing detailed, constructive feedback on grammar and writing. Your response MUST end with a line "FINAL_SCORE: X" where X is the total percentage score (0-100).`
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
      throw new Error('Failed to generate grammar feedback.');
    }

    const feedback = message.content.trim();
    return processGrammarResponse(feedback);
  } catch (error) {
    console.error('Error calling Groq API:', error.message);
    throw new Error('Failed to generate grammar feedback.');
  }
};

// Function to generate the grammar evaluation prompt
const generateGrammarPrompt = (text, rubricArray) => {
  return `
    Evaluate this text with precise grammatical analysis. Provide detailed scoring and feedback.

    **Text to Evaluate:**
    ${text}

    **Evaluation Framework:**
    ${rubricArray.map(criterion => `
    - ${criterion.criteria.toUpperCase()} (${criterion.weight} points):
      * Grammar Evaluation (40% of weight):
        - Sentence structure and syntax
        - Subject-verb agreement
        - Proper use of tenses
        - Article and preposition usage
      
      * Style and Clarity (30% of weight):
        - Sentence variety
        - Paragraph structure
        - Clarity of expression
        - Word choice

      * Technical Accuracy (30% of weight):
        - Punctuation
        - Capitalization
        - Spelling
        - Formatting

      Scoring Guidelines:
      - 90-100: Exceptional writing
      - 80-89: Strong writing with minor errors
      - 70-79: Good writing with some mistakes
      - 60-69: Basic competency shown
      - Below 60: Needs significant improvement
    `).join('\n')}

    **Required Feedback Structure:**
    1. For each criterion:
       - Identify specific grammar issues
       - Provide examples from the text
       - Suggest corrections
       - Show point calculations

    2. Overall Assessment:
       - List major strengths
       - Identify patterns of errors
       - Provide improvement strategies
       - Show point calculations

    After your detailed feedback, you MUST end with a line:
    FINAL_SCORE: [total percentage 0-100]

    Important scoring rules:
    - Consider context and writing style
    - Acknowledge effective communication
    - Balance technical accuracy with readability
    - Use precise point values
    `;
};

// Function to process grammar feedback response
const processGrammarResponse = (feedback) => {
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
    points: marks,
  };
};

module.exports = { evaluateAndStoreGrammarFeedback, getGrammarFeedbackFromGroqCloud };