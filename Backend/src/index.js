const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = process.env.NODE_ENV || 'development';  // Add this line to define env
const config = require('./config/config.js')[env];
require('dotenv').config({ path: './src/.env' });


const { sequelize } = require('./models');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const authRoutes = require('./Routes/authRoutes.js');
const assignmentRoutes = require('./Routes/assignmentRoutes.js');
const feedbackroutes = require('./Routes/feedbackRoutes.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/feedback',feedbackroutes);
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
