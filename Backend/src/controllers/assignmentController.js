// src/controllers/assignmentController.js
const multer = require('multer');
const { submitAssignment: submitAssignmentService, getAssignmentsByUser } = require('../services/assignmentService'); // Renamed imported function to avoid conflict

// Set up Multer storage (store PDF in memory as buffer)
const storage = multer.memoryStorage(); // Memory storage to get the PDF content as a buffer
const upload = multer({ storage });

// Controller method for submitting an assignment
const submitAssignment = async (req, res) => {
  const { title, content, user_id, submitted_at } = req.body;
  const pdfBuffer = req.file ? req.file.buffer : null; // Get the uploaded PDF file buffer

  try {
    // Prepare assignment data
    const assignmentData = {
      title,
      content,
      user_id,
      submitted_at,
    };

    // Submit the assignment with PDF content (if available)
    const assignment = await submitAssignmentService(assignmentData, pdfBuffer);
    
    // Respond with success message
    res.status(201).json({
      message: 'Assignment submitted successfully',
      assignment,
    });
  } catch (error) {
    console.error('Error in assignment submission:', error);
    res.status(500).json({ message: 'Failed to submit assignment' });
  }
};

// Controller method for fetching user assignments
const getUserAssignments = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is in req.user (authMiddleware)
  
  try {
    const assignments = await getAssignmentsByUser(userId);
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

// Exporting controller methods along with Multer upload
module.exports = { submitAssignment, getUserAssignments, upload };
