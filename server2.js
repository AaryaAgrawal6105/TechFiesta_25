// server2.js
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const { extractTextFromPdf } = require('./services/pdfservice');
const { getFeedbackFromGroqCloud } = require('./utils/groqCloudService');
const { generateFeedback } = require('./services/feedbackService'); // Import generateFeedback

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/evaluate-code-assignment', async (req, res) => {
  const { code, language, requirements, rubric, pdfUrl, user_id, assignment_id } = req.body;

  if (!code || !language || !requirements || !pdfUrl || !user_id || !assignment_id) {
    return res.status(400).json({
      error: 'Code, language, requirements, PDF URL, user_id, and assignment_id are required!',
    });
  }

  try {
    // Extract PDF text as JSON
    const pdfJsonData = await extractTextFromPdf(pdfUrl);

    // Get feedback from Groq Cloud API
    const feedbackData = await getFeedbackFromGroqCloud(pdfJsonData, rubric);

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const rubricObj = parseRubric(rubric);

    // First evaluation for feedback and grading
    const evaluationCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Please evaluate this ${language} code assignment and provide specific feedback:

          Code:
          ${code}

          Requirements:
          ${requirements}

          Evaluate based on these criteria:
          ${rubricObj.map((r) => `${r.criteria}: ${r.points} points`).join('\n')}

          Please provide:
          1. Detailed feedback for each criterion (with points awarded)
          2. Code quality issues and potential bugs
          3. Final Grade out of 100
          4. Suggestions for improvement`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    let feedback = '';
    for await (const chunk of evaluationCompletion) {
      feedback += chunk.choices[0]?.delta?.content || '';
    }

    // Calculate grade and points
    const { grade, points } = calculateGrade(feedback, rubricObj);

    // Generate feedback and store it in the database
    await generateFeedback({
      assignment_id,
      user_id,
      rubric_id: rubric.id,  // Ensure rubric has an ID
      score: points,
      comments: feedback.trim(),
    });

    res.status(200).json({
      evaluation: {
        feedback: feedback.trim(),
        grade: grade,
        points: points,
        rubric: rubricObj,
      },
      improvements: {
        suggestions: feedbackData.comments.trim(),
      },
    });
  } catch (error) {
    console.error('Error processing code assignment:', error.stack);
    res.status(500).json({ error: 'Failed to process the code assignment.' });
  }
});

function calculateGrade(feedback, rubric) {
  const finalGradeMatch = feedback.match(/Final Grade:\s*(\d+)\/100/);
  let totalPoints = 0;

  if (finalGradeMatch) {
    totalPoints = parseInt(finalGradeMatch[1], 10);
  } else {
    const criterionRegex = /\((\d+)\/(\d+)\)/g;
    const matches = [...feedback.matchAll(criterionRegex)];
    totalPoints = matches.reduce((sum, match) => sum + parseInt(match[1], 10), 0);
  }

  const grade = totalPoints > 70 ? 'A' : totalPoints > 50 ? 'B' : 'C';

  return { grade, points: totalPoints };
}

function parseRubric(rubric) {
  // Convert rubric into desired format
  return rubric.map((criterion) => ({
    criteria: criterion.criteria,
    points: criterion.points,
  }));
}

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
