const { Assignment } = require('../models');

// Submit Assignment: Handle storing assignment data along with the PDF content
exports.submitAssignment = async (data, pdfBuffer) => {
  try {
    // Create a new assignment and store PDF content if provided
    const assignment = await Assignment.create({
      ...data,
      pdf_content: pdfBuffer, // Store the PDF content as binary data
    });
    return assignment;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw new Error('Failed to submit assignment');
  }
};

// Get Assignments by User
exports.getAssignmentsByUser = async (userId) => {
  try {
    const assignments = await Assignment.findAll({ where: { user_id: userId } });
    return assignments;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw new Error('Failed to fetch assignments');
  }
};
