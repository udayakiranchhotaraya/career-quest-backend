const express = require('express');

const { verifyToken } = require('../middlewares/jwt.middleware');

const {
    signupUser,
    signinUser,
    updateUserDetails,
    viewUserDetails
} = require('../controllers/user.controller');

const UserRouter = express.Router();

UserRouter.post('/signup', signupUser);
UserRouter.post('/signin', signinUser);
UserRouter.get('/profile', verifyToken, viewUserDetails);
UserRouter.patch('/profile/update', verifyToken, updateUserDetails);

module.exports = UserRouter;