const { User, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');

const saltRounds = 10;

// Service to handle user registration
exports.registerUser = async (data) => {
  const { username, email, password } = data;

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create and save the new user
  const user = await User.create({ username, email, password: hashedPassword });

  return { message: 'User registered successfully', user };
};

// Service to handle user login
exports.loginUser = async ({ email, password }) => {
  // Find user by email
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = jwtUtils.generateToken({ id: user.id, email: user.email });

  // Store token in Tokens table with an expiration time
  await Token.create({
    user_id: user.id,
    token,
    expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour expiration
  });

  return { message: 'Login successful', token };
};
