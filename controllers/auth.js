const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const path = require('path')
const sendEmail = require('../utils/sendEmail')


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

 //  @desc   Current User
//  @route  POST api/v1/auth/me
//  @access Private
exports.getMe = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.user)

    res.status(200).json({
        success: true, 
        data: user
    })
})



//  @desc   forgot passwrod
//  @route  POST api/v1/auth/forgotPassword
//  @access public
exports.forgotPassword = asyncHandler(async (req, res, next)=>{
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new ErrorResponse(`There is no user with that email`, 404))
    }


    // Get the reset Token 
    const resetToken = user.getResetPasswordToken()

    //Save token to User. 
    await user.save({validateBeforeSave: false})

    //Create Reset URL
    const resetURL = `${req.protocol}://${req.get.host}/api/v1/resetPassword/${resetToken}`
    const message = `You are recieving this email because you (or someone else) has requested the reset of a password. Please makea put request to: \n\n ${resetURL} `

    try {
        await sendEmail({
            email: user.email, 
            subject: 'Password reset', 
            message
        })
        res.status(200).json({success: true, data: 'email sent'})
    }catch(err){
        console.log(err)
        user.resetPasswordToken = undefined; 
        user.resetPasswordExipre = undefined; 

        await user.save({validateBeforeSave: false})
        return next(new ErrorResponse(`Email not sent successfulltt`, 400))
    }

})
 //Get Token from Model, create cookie and send response. 
 const sendTokenResponse = (user, statusCode, res ) =>{
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true
    }
     //Create token
     const token = user.getSignedJwtToken(); 
 
     res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            sucess: true, 
            token: token
        })
 }



