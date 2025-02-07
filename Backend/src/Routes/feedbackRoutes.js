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
const { createCodeFeedback, getCodeFeedback } = require('../controllers/codeController');
// Route to handle feedback creation
router.post('/', feedbackController.createFeedback);

// Route to generate feedback for a code submission
router.post('/code', createCodeFeedback);

// Route to retrieve feedback for a given submission
router.get('/:submission_id', getCodeFeedback);
module.exports = router;


const { createGrammarFeedback, getGrammarFeedback } = require('../controllers/grammerController');

router.post('/grammar-feedback', createGrammarFeedback);
router.get('/grammar-feedback/:assignment_id', getGrammarFeedback);

