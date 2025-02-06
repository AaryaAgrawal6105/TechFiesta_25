const { submitAssignment: submitAssignmentService, getAssignmentsByUser } = require('../services/assignmentService');
const { upload } = require('../config/cloudinary');

// Controller for submitting an assignment
const submitAssignment = async (req, res) => {
  const { title, content, user_id, submitted_at } = req.body;
  const pdfUrl = req.file ? req.file.path : null; // Get Cloudinary URL

  try {
    const assignmentData = {
      title,
      content,
      user_id,
      submitted_at,
      pdfUrl,  // Ensure PDF URL is passed here
    };

    const assignment = await submitAssignmentService(assignmentData, pdfUrl);

    res.status(201).json({
      message: 'Assignment submitted successfully',
      assignment,
    });
  } catch (error) {
    console.error('Error in assignment submission:', error);
    res.status(500).json({ message: 'Failed to submit assignment' });
  }
};

// Controller for fetching user assignments
const getUserAssignments = async (req, res) => {
  const userId = req.user.id;

  try {
    const assignments = await getAssignmentsByUser(userId);
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

module.exports = { submitAssignment, getUserAssignments, upload };
