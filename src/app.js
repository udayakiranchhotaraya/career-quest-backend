const express = require('express');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`API running in ${process.env.NODE_ENV} mode`);
});

module.exports = app;