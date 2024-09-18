const express = require('express');

const UserRouter = require('./user.router');
const EmployerRouter = require('./employer.router');

const router = express.Router();

// Route for user-related endpoints, using UserRouter for handling user routes
router.use('/user', UserRouter);

// Route for employer-related endpoints, using EmployerRouter for handling employer routes
router.use('/employer', EmployerRouter);

module.exports = router;