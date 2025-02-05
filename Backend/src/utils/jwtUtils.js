const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Ensure the secret is set

// Function to generate JWT
exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Adjust expiration as needed
};

// Function to verify JWT
exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
