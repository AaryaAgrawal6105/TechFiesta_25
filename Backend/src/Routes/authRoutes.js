const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Use register from controller
router.post('/login', authController.login);     // Use login from controller

module.exports = router;
