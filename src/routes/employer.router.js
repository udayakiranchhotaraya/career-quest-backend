const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const { 
    registerEmployer,
    loginEmployer 
} = require('../controllers/employer.controller');

const EmployerRouter = express.Router();

// Route for employer registration, calls registerEmployer controller
EmployerRouter.post('/register', registerEmployer);

// Route for employer login, calls loginEmployer controller
EmployerRouter.post('/login', loginEmployer);

module.exports = EmployerRouter;