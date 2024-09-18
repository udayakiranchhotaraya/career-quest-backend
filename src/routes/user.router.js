const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const {
    signupUser,
    signinUser,
    updateUserDetails,
    viewUserDetails,
    deleteUser,
    addEducation,
    updateEducation
} = require('../controllers/user.controller');

const UserRouter = express.Router();

// Route for user signup, calls signupUser controller
UserRouter.post('/signup', signupUser);

// Route for user signin, calls signinUser controller
UserRouter.post('/signin', signinUser);

// Route to view user profile details, protected by JWT token, calls viewUserDetails controller
UserRouter.get('/profile', verifyToken, viewUserDetails);

// Route to update user profile details, protected by JWT token, calls updateUserDetails controller
UserRouter.put('/profile/update', verifyToken, updateUserDetails);

// Route to delete user profile, protected by JWT token, calls deleteUser controller
UserRouter.delete('/profile/delete', verifyToken, deleteUser);

// Route to add education to user profile, protected by JWT token, calls addEducation controller
UserRouter.post('/profile/education/add', verifyToken, addEducation);

// Route to update specific education entry in user profile, protected by JWT token, calls updateEducation controller
UserRouter.put('/profile/education/:educationId/update', verifyToken, updateEducation);

module.exports = UserRouter;