const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwtUtils');

exports.registerUser = async (data) => {
  const { username, email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  return { message: 'User registered successfully', user };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  const token = jwtUtils.generateToken({ id: user.id, email: user.email });
  return { message: 'Login successful', token };
};
