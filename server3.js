import express from 'express';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';
import tesseract from 'node-tesseract-ocr';
import { createWorker } from 'tesseract.js';
import mathpix from 'mathpix-node';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Configure Mathpix
mathpix.config({
  api_key: process.env.MATHPIX_API_KEY,
  app_id: process.env.MATHPIX_APP_ID
});

// OCR Configuration
const tesseractConfig = {
  lang: "eng+equ", // English + Math equations
  oem: 3,
  psm: 6,
};

app.post('/extract-assignment', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfBuffer = req.file.buffer;
    const extractedData = await extractFromPDF(pdfBuffer);
    const structuredData = await processExtractedData(extractedData);

    res.json(structuredData);
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

async function extractFromPDF(pdfBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const textContent = [];
  
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPages()[i];
    
    // Extract typed text
    const typedText = await extractTypedText(page);
    
    // Extract handwritten text using Tesseract
    const handwrittenText = await extractHandwrittenText(page);
    
    // Extract mathematical equations using Mathpix
    const equations = await extractMathEquations(page);
    
    textContent.push({
      typed: typedText,
      handwritten: handwrittenText,
      equations: equations
    });
  }
  
  return textContent;
}

async function extractTypedText(page) {
  // Basic text extraction for typed content
  const { width, height } = page.getSize();
  const textContent = await page.getTextContent();
  return textContent;
}

async function extractHandwrittenText(page) {
  // Convert page to image for OCR
  const worker = await createWorker();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  
  const { data } = await worker.recognize(page);
  await worker.terminate();
  
  return data;
}

async function extractMathEquations(page) {
  // Use Mathpix for equation recognition
  const result = await mathpix.process({
    src: page,
    formats: ['text', 'latex'],
    ocr: ['math', 'text']
  });
  
  return result;
}

async function processExtractedData(extractedData) {
  // Process and structure the extracted data
  const processedData = {
    code: "",
    language: detectProgrammingLanguage(extractedData),
    requirements: [],
    rubric: ""
  };

  // Process each page's content
  for (const page of extractedData) {
    // Combine typed and handwritten text
    const allText = `${page.typed}\n${page.handwritten}`;
    
    // Extract code blocks
    processedData.code += extractCodeBlocks(allText);
    
    // Extract requirements
    const pageRequirements = extractRequirements(allText);
    processedData.requirements.push(...pageRequirements);
    
    // Extract rubric
    const pageRubric = extractRubric(allText);
    if (pageRubric) {
      processedData.rubric += pageRubric + '\n';
    }
  }

  return processedData;
}

function detectProgrammingLanguage(content) {
  // Implement language detection based on common patterns
  const patterns = {
    'C++': /(#include|using namespace|class.*{|public:|private:)/,
    'Python': /(def |import |class.*:|\s{4})/,
    'JavaScript': /(function |const |let |var |=>)/
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(content)) {
      return lang;
    }
  }

  return 'Unknown';
}

function extractCodeBlocks(text) {
  // Extract code blocks using common patterns
  const codeBlockRegex = /```[\s\S]*?```|(?:(?:^|\n)\s{4}[^\n]+)+/g;
  const matches = text.match(codeBlockRegex) || [];
  return matches.join('\n').replace(/```/g, '').trim();
}

function extractRequirements(text) {
  // Extract requirements using common patterns
  const requirementRegex = /(?:requirements?:|tasks?:)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi;
  const matches = text.match(requirementRegex) || [];
  return matches
    .map(req => req.split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^\d+\.\s*|\*\s*|requirements?:|tasks?:/gi, '').trim()))
    .flat();
}

function extractRubric(text) {
  // Extract rubric using common patterns
  const rubricRegex = /(?:rubric:|grading criteria:)[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi;
  const matches = text.match(rubricRegex) || [];
  return matches
    .map(rub => rub.replace(/rubric:|grading criteria:/gi, '').trim())
    .join('\n');
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`PDF extraction server running on port ${PORT}`);
});