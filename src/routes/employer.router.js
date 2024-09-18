const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const { 
    registerEmployer,
    loginEmployer, 
    updateEmployerDetails,
    viewEmployerDetails
} = require('../controllers/employer.controller');

const JobRouter = require('./job.routes/job.employer.router');
const checkEmployer = require('../middlewares/checkEmployer.middleware');

const EmployerRouter = express.Router();

// Route for employer registration, calls registerEmployer controller
EmployerRouter.post('/register', registerEmployer);

// Route for employer login, calls loginEmployer controller
EmployerRouter.post('/login', loginEmployer);

// Route to view employer details, protected by JWT token and checkEmployer middleware, calls viewEmployerDetails controller
EmployerRouter.get('/details', verifyToken, checkEmployer, viewEmployerDetails);

// Route to update employer details, protected by JWT token and checkEmployer middleware, calls updateEmployerDetails controller
EmployerRouter.put('/details/update', verifyToken, checkEmployer, updateEmployerDetails);

// Route for job-related endpoints, protected by JWT token and checkEmployer middleware, using JobRouter for handling job routes
EmployerRouter.use('/job', verifyToken, checkEmployer, JobRouter);

module.exports = EmployerRouter;