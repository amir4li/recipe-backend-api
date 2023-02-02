const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("../middlewares/asyncMiddleware");
const ErrorResponse = require("../utils/errorResponse");


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res)=> {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({ success: true, token, user })
};


// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next)=> {
    const { name, email, password} = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    // Create and send token
    sendTokenResponse(user, 200, res);
});


// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next)=> {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    };

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    };

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    };

    // Create and send token
    sendTokenResponse(user, 200, res);
});


// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next)=> {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.bodly.email
    }
    const user = await User.findById(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});


// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next)=> {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse("Password is incorrect", 401));
    };

    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
});


// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next)=> {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});



