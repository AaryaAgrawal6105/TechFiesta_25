const { Assignment } = require('../models');

exports.submitAssignment = async (data) => {
  const assignment = await Assignment.create(data);
  return assignment;
};

exports.getAssignmentsByUser = async (userId) => {
  const assignments = await Assignment.findAll({ where: { user_id: userId } });
  return assignments;
};
