// src/routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST route for submitting an assignment (with PDF upload)
router.post('/submit', authMiddleware, assignmentController.upload.single('pdf'), assignmentController.submitAssignment);

// GET route for fetching user assignments
router.get('/my-assignments', authMiddleware, assignmentController.getUserAssignments);

module.exports = router;
