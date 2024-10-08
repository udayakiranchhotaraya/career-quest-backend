const mongoose = require('mongoose');
const { generateToken } = require('../middlewares/jwt.middleware');

const User = require('../models/user.model');

async function signupUser (req, res) {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ "message": "User already exists." });
        }

        // Create new user
        const newUser = await User.create({
            name: name,
            email: email,
            mobile: mobile,
            password: password
        });

        // Generate JWT token
        const payload = {
            id: newUser._id,
            isEmployer: false
        };
        const token = generateToken(payload);

        return res.status(201).json({ 
            "message": "User registration successful", 
            "token": token 
        });
    } catch (error) {
        return res.status(400).json({ "message": error.message});
    }
}

async function signinUser(req, res) {
    const { loginIdentifier, password } = req.body;

    try {
        // Find user by email or mobile using $or query
        const user = await User.findOne({ 
            $or: [ 
                { email: { $eq: loginIdentifier } }, 
                { mobile: { $eq: loginIdentifier } } 
            ] 
        });

        // If user is not found or password does not match
        if (!(user) || !(await user.comparePassword(password))) {
            return res.status(401).json({ "message": "Invalid credentials" });
        }

        // Generate JWT token
        const payload = {
            id: user._id,
            isEmployer: false
        };
        const token = generateToken(payload);

        // Send response with JWT token
        return res.status(200).json({
            "message": "Sign-in successful",
            "token": token
        });
    } catch (error) {
        return res.status(400).json({ "message": error.message });
    }
}

async function updateUserDetails(req, res) {
    try {
        // Extract user ID from req.user (set in JWT middleware)
        const { id } = req.user;        

        // Destructure the incoming details (assuming they are optional)
        const { name, email, mobile, profilePictureURL, resumeURL } = req.body;

        // Find the user by ID and update the details
        const updatedUser = await User.findByIdAndUpdate(id, 
            {
                $set: {
                    ...(name && { name }), // Update name if provided
                    ...(email && { email }), // Update email if provided
                    ...(mobile && { mobile }), // Update mobile if provided
                    ...(profilePictureURL && { profilePictureURL }), // Update profile picture
                    ...(resumeURL && { resumeURL }), // Update resume URL
                }
            }, 
            { new: true, runValidators: true } // Returns updated document, validate updates
        );

        // Return updated user details
        return res.status(200).json({ "message": "User details updated successfully" });
    } catch (error) {
        return res.status(400).json({ "message": error.message });
    }
}

async function viewUserDetails(req, res) {
    try {
        // Extract user ID from req.user (set in JWT middleware)
        const { id } = req.user;

        // Find the user by ID, exclude the password field
        const user = await User.findOne({ _id: id }, { password: 0 });

        // Return the user details
        return res.status(200).json({ "user": user });
    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.user; // Extract user ID from JWT middleware

        // Find the user and delete the account
        await User.findByIdAndDelete(id);

        return res.status(200).json({ "message": "User account deleted successfully." });
    } catch (error) {
        return res.status(500).json({ "message": "Internal server error.", "error": error.message });
    }
}

async function addEducation(req, res) {
    try {
        // Extract user ID from req.user (set by JWT middleware)
        const { id } = req.user;

        // Extract education details from request body
        const { institution, degree, yearOfCompletion } = req.body;

        // Find user by ID and update the education field
        await User.findOneAndUpdate(
            { _id: id },
            { 
                $push : {
                    educations: {
                        institution: institution,
                        degree: degree,
                        yearOfCompletion: yearOfCompletion
                    }
                }
            }, // Push new education into the education array
            { new: true, runValidators: true } // Return updated user and run validation on the fields
        );

        // Send success response with updated user data
        return res.status(200).json({ "message": "Education added successfully" });

    } catch (error) {
        return res.status(500).json({ "message": error.message });
    }
}

async function updateEducation(req, res) {
    try {
        // Extract user ID from req.user (set in JWT middleware)
        const { id } = req.user;

        // Extract the educationId from request parameters.
        // This ID is used to locate and update a specific education entry in the user's profile.
        const { educationId } = req.params;

        // Extract education details from request body
        const { institution, degree, yearOfCompletion } = req.body;

        // Find the user and update the specific education entry
        await User.findOneAndUpdate(
            { _id: id, 'educations._id': educationId },
            { 
                $set: {
                    'educations.$.institution': institution,
                    'educations.$.degree': degree,
                    'educations.$.yearOfCompletion': yearOfCompletion
                }
            },
            { new: true, runValidators: true } // Returns updated document, validate updates
        );

        // Return updated user details
        return res.status(200).json({ "message": "Education details updated successfully" });
    } catch (error) {
        return res.status(400).json({ "message": error.message });
    }
}

async function deleteEducation(req, res) {
    try {
        // Extract the user ID from req.user (set by JWT middleware)
        const { id } = req.user;
        
        // Extract the educationId from request parameters
        const { educationId } = req.params;
        
        // Find the user by ID and update the education field
        await User.findOneAndUpdate(
            { _id: id },
            { 
                $pull: { 
                    educations: { _id: educationId } 
                } 
            }, // Remove the specific education entry
            { new: true, runValidators: true } // Returns updated document, validate updates
        );
          
        // Return a success message with the updated user details
        return res.status(200).json({ "message": "Education entry deleted successfully" });
    } catch (error) {
        return res.status(400).json({ "message": error.message });
    }
}

module.exports = {
    signupUser,
    signinUser,
    updateUserDetails,
    viewUserDetails,
    deleteUser,
    addEducation,
    updateEducation,
    deleteEducation
}