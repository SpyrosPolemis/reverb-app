// server/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON bodies

// A simple test route
app.get('/api', (req, res) => {
  res.json({ message: "Hello from the server! 👋" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});