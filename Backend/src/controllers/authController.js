const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { User, Token } = require('../models');

const saltRounds = 10; // Number of salt rounds for hashing

// Register Function: Hash the password before saving
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    await User.create({ email, password: hashedPassword, username });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in registration:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Login Function: Compare the hashed password
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('JWT Secret:', process.env.JWT_SECRET);
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store token in Tokens table
    await Token.create({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour expiration
    });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login };
