const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const path = require('path')


// @desc    Get Reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public  
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) { //If looking for specific Id, no need for aR
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({ 
            success: true, 
            count: reviews.length, 
            data: reviews
        })
    } else {//On all other queries, send advanced Results.
        res.status(200).json(res.advancedResults)
    }
    
})

// @desc    Get Get Single Review
// @route   GET /api/v1/reviews/:id
// @access  Public  
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if(!review){
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404))
    }
  
    res.status(200).json({
        success: true, 
        data: review
    })
})

// @desc    Add Review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId 
    req.body.user = req.user.id

    const bootcamp = await bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next( new ErrorResponse(`No bootcamp found with id ${req.params.id}`,404))
    }

    const review = await Review.create(req.body)
  
    res.status(201).json({
        success: true, 
        data: review
    })
})