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
