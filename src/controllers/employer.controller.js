const mongoose = require('mongoose');
const { generateToken } = require('../middlewares/jwt.middleware');

const Employer = require('../models/employer.model');

async function registerEmployer(req, res) {
    try {
        const { accessEmail, accessPassword, companyName } = req.body;

        // Check if the employer already exists
        const existingEmployer = await Employer.findOne({ accessEmail: accessEmail });
        if (existingEmployer) {
            return res.status(400).json({ "message": "Employer already exists." });
        }

        // Create new employer with required fields
        const newEmployer = await Employer.create({
            accessEmail: accessEmail,
            accessPassword: accessPassword,
            companyName: companyName
        });

        // Generate JWT token
        const payload = {
            id: newEmployer._id,
            isEmployer: true
        };
        const token = generateToken(payload);

        return res.status(201).json({ "message": "Employer registration successful", "token": token });
    } catch (error) {
        return res.status(400).json({ "message": error.message });
    }
}

module.exports = { 
    registerEmployer 
};
