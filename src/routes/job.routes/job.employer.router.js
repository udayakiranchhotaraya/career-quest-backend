const express = require('express');

const { 
    createJob, 
    viewEmployerJobs,
    viewJobDetails
} = require('../../controllers/job.controllers/job.employer.controller');

const JobRouter = express.Router();

JobRouter.post('/', createJob);

JobRouter.get('/', viewEmployerJobs);

JobRouter.get('/:jobId/details', viewJobDetails);

module.exports = JobRouter;