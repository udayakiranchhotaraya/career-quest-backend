const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const { 
    registerEmployer,
    loginEmployer, 
    updateEmployerDetails
} = require('../controllers/employer.controller');

const EmployerRouter = express.Router();

// Route for employer registration, calls registerEmployer controller
EmployerRouter.post('/register', registerEmployer);

// Route for employer login, calls loginEmployer controller
EmployerRouter.post('/login', loginEmployer);

EmployerRouter.put('/details/update', verifyToken, updateEmployerDetails);

module.exports = EmployerRouter;