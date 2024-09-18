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

        return res.status(201).json({ "message": "Job created successfully", job: newJob[0] });
    } catch (error) {
        // Abort the transaction in case of error
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ "message": error.message });
    }
}

module.exports = {
    createJob
};