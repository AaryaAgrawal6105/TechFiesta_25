const Assignment = require('../models').Assignment;

// Submit Assignment: Store Cloudinary PDF URL instead of binary data
exports.submitAssignment = async (data, pdfUrl) => {
  try {
    const assignment = await Assignment.create({
      ...data,
      pdf_url: pdfUrl, // Store Cloudinary URL
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
