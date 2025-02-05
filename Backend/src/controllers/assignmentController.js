const assignmentServices = require('../services/assignmentService');

exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await assignmentServices.submitAssignment({
      user_id: req.user.id,
      ...req.body
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserAssignments = async (req, res) => {
  try {
    const assignments = await assignmentServices.getAssignmentsByUser(req.user.id);
    res.status(200).json(assignments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


