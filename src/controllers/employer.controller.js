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

async function loginEmployer(req, res) {
    const { accessEmail, accessPassword } = req.body;

    try {
        // Find the employer by email
        const employer = await Employer.findOne({ accessEmail: accessEmail });

        // If employer is not found or password does not match
        if (!(employer) || !(await employer.comparePassword(accessPassword))) {
            return res.status(401).json({ "message": "Invalid credentials" });
        }

        // Generate JWT token
        const payload = {
            id: employer._id,
            isEmployer: true
        };
        const token = generateToken(payload);

        // Respond with success message and token
        return res.status(200).json({ "message": "Login successful", "token": token });
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

module.exports = { 
    registerEmployer,
    loginEmployer
};
