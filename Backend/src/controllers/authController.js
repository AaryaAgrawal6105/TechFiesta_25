
// Correct import in authController.js
const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Call the register service
    const result = await registerUser({ email, password, username });
    return res.status(201).json(result);
  } catch (err) {
    console.error('Error in registration:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the login service
    const result = await loginUser({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login };
