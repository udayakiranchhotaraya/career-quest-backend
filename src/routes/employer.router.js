const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const { 
    registerEmployer 
} = require('../controllers/employer.controller');

const EmployerRouter = express.Router();

// Route for employer registration, calls registerEmployer controller
EmployerRouter.post('/register', registerEmployer);

module.exports = EmployerRouter;