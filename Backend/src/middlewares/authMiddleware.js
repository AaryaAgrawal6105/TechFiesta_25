const jwt = require('jsonwebtoken');
const { Token } = require('../models');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object

    // Check if the token exists in the database
    const storedToken = await Token.findOne({
      where: {
        user_id: decoded.id, // Match the user ID from decoded JWT
        token: token, // Match the token from the header
      },
    });

    if (!storedToken) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
