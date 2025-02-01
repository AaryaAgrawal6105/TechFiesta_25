

require('dotenv').config();

// Import required libraries
const express = require('express');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.json());


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(process.env.DB_PASS);
    console.log(`Server is running on port ${PORT}`);
});
