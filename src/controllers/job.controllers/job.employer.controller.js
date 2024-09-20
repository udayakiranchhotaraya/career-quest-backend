const mongoose = require('mongoose');

const { Employer, Job } = require('../../models');

async function createJob(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const employerID = req.user.id
        const { jobTitle, jobDescription, location, jobType, workMode, responsibilities, requirements, salary, yearsOfExperience } = req.body;

        // Validate required fields
        if (!jobTitle || !jobDescription || !employerID || !location || !jobType || !workMode || !responsibilities || !requirements || !salary || !yearsOfExperience) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ "message": "All fields are required." });
        }

        // Create a new job
        const newJob = await Job.create([{
            jobTitle,
            jobDescription,
            employerID,
            location,
            jobType,
            workMode,
            responsibilities,
            requirements,
            salary,
            yearsOfExperience
        }], { session });

        // Update the employer's jobPostings
        await Employer.findOneAndUpdate(
            { _id: employerID },
            { 
                $push: { 
                    jobPostings: newJob[0]._id 
                } 
            },
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ "message": "Job created successfully" });
    } catch (error) {
        // Abort the transaction in case of error
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ "message": error.message });
    }
}

async function viewEmployerJobs(req, res) {
    try {
        // Extract employer ID from req.user (set by JWT middleware)
        const { id } = req.user;

        // Find the employer and populate the jobs they have posted
        // const employer = await Employer.findOne({ _id: id }).populate('jobPostings', '-__v').exec();
        
        // --alternative way to see only selected fields from job--
        const employer = await Employer.findOne({ _id: id })
        .populate({
            path: 'jobPostings',
            select: 'jobTitle jobDescription status _id', // Specify the fields to include
            options: { lean: true } // Returns plain JS objects instead of Mongoose documents
        })
        .exec();

        if (!employer) {
            return res.status(404).json({ "message": "Employer not found." });
        }

        return res.status(200).json({ "jobs": employer.jobPostings });
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

async function viewJobDetails (req, res) {
    try {
        const employerId = req.user.id; // Extract employer ID from JWT (set by middleware)
        const { jobId } = req.params;  // Extract job ID from request params

        // Find the job posted by the employer
        const job = await Job.findOne({ _id: jobId, employerID: employerId }, { password: 0 });

        // If job is not found or doesn't belong to the employer
        if (!job) {
            return res.status(404).json({ "message": "Job not found" });
        }

        // Return the job details
        return res.status(200).json({ "job" : job });
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

module.exports = {
    createJob,
    viewEmployerJobs,
    viewJobDetails
};