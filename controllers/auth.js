const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const path = require('path')


//  @desc   Register User
//  @route  POST api/v1/auth/register
//  @access Public
exports.register = asyncHandler(async (req, res, next)=>{
   const { name, email, password, role } = req.body; 

   //Create User 
   const user = await User.create({
       name,
       email,
       password,
       role
   })

   sendTokenResponse(user, 200, res)

})


//  @desc   Login User
//  @route  POST api/v1/auth/login
//  @access Public
exports.login = asyncHandler(async (req, res, next)=>{
    const { email, password } = req.body; 
 
    //Validate Email and Password
    if(!email || !password){
        return next(new ErrorResponse(`Please provide a valid email and password`,400))
    }

    //Check for User.
    const user = await User.findOne({email: email}).select('+password')

    if(!user){
        return next(new ErrorResponse(`Invalid Credentials`,401))
    }

    //Check if password matches. 
    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return next(new ErrorResponse(`Invalid Credentials`,401))
    }

    sendTokenResponse(user, 200, res)
   
 })

 //Get Token from Model, create cookie and send response. 
 const sendTokenResponse = (user, statusCode, res ) =>{
    const options = {
        expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

     //Create token
     const token = user.getSignedJwtToken(); 
 
     res
        .status(statusCode)
        .cookie('token', token, optionsS)
        .json({
            sucess: true, 
            token: token
        })
 }