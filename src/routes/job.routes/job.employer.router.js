const express = require('express');

const { 
    createJob 
} = require('../../controllers/job.controllers/job.employer.controller');

const JobRouter = express.Router();

JobRouter.post('/', createJob);

module.exports = JobRouter;