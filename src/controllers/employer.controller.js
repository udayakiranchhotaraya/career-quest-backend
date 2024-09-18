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

async function updateEmployerDetails(req, res) {
    try {
        // Extract employer ID from req.user (set in JWT middleware)
        const { id } = req.user;

        // Destructure the incoming details (assuming they are optional)
        const {
            companyName,
            companyWebsite,
            companyDescription,
            industry,
            numberOfEmployees,
            yearOfEstablishment,
            contactEmail,
            contactTelephone,
            address,
            location,
            companyLogoURL,
            benefits
        } = req.body;

        // Find the employer by ID and update the details
        const updatedEmployer = await Employer.findByIdAndUpdate(id,
            {
                $set: {
                    ...(companyName && { companyName }), // Update companyName if provided
                    ...(companyWebsite && { companyWebsite }), // Update companyWebsite if provided
                    ...(companyDescription && { companyDescription }), // Update companyDescription if provided
                    ...(industry && { industry }), // Update industry if provided
                    ...(numberOfEmployees && { numberOfEmployees }), // Update numberOfEmployees if provided
                    ...(yearOfEstablishment && { yearOfEstablishment }), // Update yearOfEstablishment if provided
                    ...(contactEmail && { contactEmail }), // Update contactEmail if provided
                    ...(contactTelephone && { contactTelephone }), // Update contactTelephone if provided
                    ...(address && { address }), // Update address if provided
                    ...(location && { location }), // Update location if provided
                    ...(companyLogoURL && { companyLogoURL }), // Update companyLogoURL if provided
                    ...(benefits && { benefits }) // Update benefits if provided
                }
            },
            { new: true, runValidators: true } // Returns updated document, validate updates
        );

        if (!updatedEmployer) {
            return res.status(404).json({ "message": "Employer not found" });
        }

        // Return the updated employer details
        return res.status(200).json({
            "message": "Employer details updated successfully",
            "employer": updatedEmployer
        });
    } catch (error) {
        return res.status(400).json({ "message": error.message });
    }
}

module.exports = { 
    registerEmployer,
    loginEmployer,
    updateEmployerDetails
};
