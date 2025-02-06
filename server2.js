import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/evaluate-code-assignment", async (req, res) => {
  const { code, language, requirements, rubric } = req.body;

  if (!code || !language || !requirements) {
    return res.status(400).json({ 
      error: "Code, language, and requirements are required!" 
    });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Parse the provided rubric
    const rubricObj = parseRubric(rubric);

    // First evaluation for feedback and grading
    const evaluationCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Please evaluate this ${language} code assignment and provide specific feedback:
          
          Code:
          ${code}

          Requirements:
          ${requirements}
          
          Evaluate based on these criteria:
          ${rubricObj.map(r => `${r.criteria}: ${r.points} points`).join('\n')}
          
          Please provide:
          1. Detailed feedback for each criterion (with points awarded)
          2. Code quality issues and potential bugs
          3. Final Grade out of 100
          4. Suggestions for improvement`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    let feedback = "";
    for await (const chunk of evaluationCompletion) {
      feedback += chunk.choices[0]?.delta?.content || "";
    }

    // Second API call for code improvements
    const improvementCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Based on this ${language} code:
          ${code}
          
          And these requirements:
          ${requirements}
          
          Please provide:
          1. An improved version of the code that addresses any issues
          2. Detailed explanations of the improvements made
          3. Best practices implemented in the improved version
          
          Format the response with clear sections for the improved code and explanations.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    let improvements = "";
    for await (const chunk of improvementCompletion) {
      improvements += chunk.choices[0]?.delta?.content || "";
    }

    const { grade, points } = calculateGrade(feedback, rubricObj);

    res.status(200).json({
      evaluation: {
        feedback: feedback.trim(),
        grade: grade,
        points: points,
        rubric: rubricObj
      },
      improvements: {
        suggestions: improvements.trim()
      }
    });

  } catch (error) {
    console.error("Error processing code assignment:", error.stack);
    res.status(500).json({ error: "Failed to process the code assignment." });
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

  const percentage = totalPoints;

  let grade;
  if (percentage >= 90) grade = "A";
  else if (percentage >= 80) grade = "B";
  else if (percentage >= 70) grade = "C";
  else if (percentage >= 60) grade = "D";
  else grade = "F";

  return {
    grade: `${grade} (${percentage}%)`,
    points: totalPoints
  };
}

function parseRubric(rubricString) {
  const lines = rubricString.split('\n').filter(line => line.trim());
  
  return lines.map(line => {
    const match = line.match(/^(.+?):?\s*(\d+)\s*$/);
    if (match) {
      return {
        criteria: match[1].trim(),
        points: match[2].trim()
      };
    }
    const parts = line.split(':').map(part => part.trim());
    return {
      criteria: parts[0],
      points: parts[1]?.replace(/[^\d]/g, '')
    };
  }).filter(item => item.criteria && item.points);
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});