const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    applicantID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    appliedAt : {
        type: Date,
        default: Date.now
    }
}, {
    _id: false
})

const jobSchema = new mongoose.Schema({
    jobTitle : {
        type: String,
        required: true
    },
    jobDescription : {
        type: String,
        required: true
    },
    employerID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    location : {
        type: String,
        required: true
    },
    jobType : {
        type: String,
        enum: ['full-time', 'part-time', 'internship'],
        required: true
    },
    workMode : {
        type: String,
        enum: ['remote', 'onsite'],
        required: true
    },
    responsibilities : {
        type: String,
        required: true
    },
    requirements : {
        type: String,
        required: true
    },
    salary : {
        minSalary : {
            type: String,
            required: true
        },
        maxSalary : {
            type: String,
            required: true
        }
    },
    yearsOfExperience : {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    applicants : [applicantSchema]
}, {
    timestamps: true
});

const JobModel = mongoose.model('Job', jobSchema);
module.exports = JobModel;