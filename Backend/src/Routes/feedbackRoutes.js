// const express = require('express');
// const { validateToken } = require('../middlewares/authMiddleware'); 
// const router = express.Router();

// router.post('/upload', validateToken, (req, res) => {
//   // File upload logic here, e.g., using multer for file handling
//   return res.status(200).json({ message: 'File uploaded successfully' });
// });

// module.exports = router;
// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to handle feedback creation
router.post('/', feedbackController.createFeedback);

module.exports = router;



