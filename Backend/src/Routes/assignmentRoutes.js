const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/submit', authMiddleware, assignmentController.submitAssignment);
router.get('/my-assignments', authMiddleware, assignmentController.getUserAssignments);

module.exports = router;




