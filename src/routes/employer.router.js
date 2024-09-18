const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const { 
    registerEmployer,
    loginEmployer, 
    updateEmployerDetails,
    viewEmployerDetails
} = require('../controllers/employer.controller');

const EmployerRouter = express.Router();

// Route for employer registration, calls registerEmployer controller
EmployerRouter.post('/register', registerEmployer);

// Route for employer login, calls loginEmployer controller
EmployerRouter.post('/login', loginEmployer);

// Route to view employer details, protected by JWT token, calls viewEmployerDetails controller
EmployerRouter.get('/details', verifyToken, viewEmployerDetails);

// Route to update employer details, protected by JWT token, calls updateEmployerDetails controller
EmployerRouter.put('/details/update', verifyToken, updateEmployerDetails);

module.exports = EmployerRouter;