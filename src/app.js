const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const router = require('./routes');
const logger = require('./utils/logger');

const app = express();

// Enables CORS with specific origin from environment variable and allows credentials (cookies, authentication)
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());
// Middleware to parse URL-encoded data from forms into req.body (extended option allows nested objects)
app.use(express.urlencoded({ extended: true }));
// Serves static files from the 'public' directory
app.use(express.static('public'));

// Use Morgan to log HTTP requests in 'dev' mode for development, 'combined' for production
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logger.stream }));

// Routes
app.get('/', (req, res) => {
  res.send(`API running in ${process.env.NODE_ENV} mode`);
});

app.use('/api', router);

module.exports = app;