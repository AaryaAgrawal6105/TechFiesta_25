import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/evaluate-math-assignment", async (req, res) => {
  const { assignment, rubric } = req.body;

  if (!assignment || !rubric) {
    return res.status(400).json({ error: "Assignment and rubric are required!" });
  }

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Parse the provided rubric
    const rubricObj = parseRubric(rubric);
    
    if (!rubricObj.length) {
      return res.status(400).json({ error: "Invalid rubric format" });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Please evaluate this math problem and provide specific feedback for each rubric criterion:
          Problem: ${JSON.stringify(assignment)}
          
          Evaluate based on these criteria:
          ${rubricObj.map(r => `${r.criteria}: ${r.points} points`).join('\n')}
          
          Please format your response as:
          Criterion: Comments (Points awarded)
          Final Grade: X/100`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
    });

    let feedback = "";
    for await (const chunk of chatCompletion) {
      feedback += chunk.choices[0]?.delta?.content || "";
    }

    if (!feedback) {
      console.error("Failed to generate feedback.");
      return res.status(500).json({ error: "Failed to generate feedback." });
    }

    const { grade, points } = calculateGrade(feedback, rubricObj);

    res.status(200).json({
      feedback: feedback.trim(),
      grade: grade,
      points: points,
      rubric: rubricObj,
    });
  } catch (error) {
    console.error("Error processing assignment:", error.stack);
    res.status(500).json({ error: "Failed to process the assignment." });
  }
});

function calculateGrade(feedback, rubric) {
  // Parse the final grade directly from the feedback
  const finalGradeMatch = feedback.match(/Final Grade:\s*(\d+)\/100/);
  let totalPoints = 0;
  
  if (finalGradeMatch) {
    totalPoints = parseInt(finalGradeMatch[1], 10);
  } else {
    // Fallback to parsing individual criterion points
    const criterionRegex = /\((\d+)\/(\d+)\)/g;
    const matches = [...feedback.matchAll(criterionRegex)];
    
    totalPoints = matches.reduce((sum, match) => sum + parseInt(match[1], 10), 0);
  }

  const percentage = totalPoints; // Already a percentage out of 100

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

// Rest of the server code remains the same...

function escapeRegExp(string) {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
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