const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const advancedResults = require('../middleware/advancedResults')
// @Desc Get All Users 
// @route GET /api/v1/auth/users
// @access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next)=>{
    res.status(200).json(res.advancedResults)
})

// @Desc Get Single User 
// @route GET /api/v1/auth/user/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next)=>{
    const user = await User.findById(req.params.id)

    res.status(200).json({success: true, data: user})
})


// @Desc Create Single User 
// @route POST /api/v1/auth/users
// @access Private/Admin
exports.createUser = asyncHandler(async (req, res, next)=>{
    const user = await User.create(req.body)

    res.status(201).json({success: true, data: user})
})


// @Desc Update Single User 
// @route POST /api/v1/auth/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next)=>{
    const user = await User.findByIdAndUpdate(req.params.id, req.body,{
        new: true, 
        runValidators: true
    })

    res.status(200).json({success: true, data: user})
})

// @Desc Delete Single User 
// @route DELETE /api/v1/auth/users/:id
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next)=>{
    await User.findByIdAndDelete(req.params.id)

    res.status(201).json({success: true, data: {}})
})