const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')

// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    //Copy Req.query
    const reqQuery = { ...req.query }

    //Fields to Exclude from query
    const removeFields = ['select', 'sort']
    //Loop over remove fields, delete from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    //Create Query String
    let queryStr = JSON.stringify(reqQuery)

    //Formate qString to have mongoDB operators.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //Find resource
    query = Bootcamp.find(JSON.parse(queryStr))

    //SELECT only certain fields.
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query.select(fields)
    }

    //Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //Execute Query
    const bootcamps = await query
    console.log(bootcamps)
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
})

// @desc    Get Single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
    }
    res.status(200).json({ sucess: true, data: bootcamp })
})

// @desc    Create New Bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private 
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data: bootcamp
    })

})

// @desc    Update Single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private 
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
    }
    res.status(200).json({ sucess: true, data: bootcamp })

})


// @desc    Delete Single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private 
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
    }
    res.status(200).json({ sucess: true, data: {} })
})


// @desc    Get Bootacmps within a radius
// @route   Get /api/v1/bootcamps/radius/:zipCode/:distance
// @access  Private 
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipCode, distance } = req.params

    //Get Lat/Long from Geocoder
    const loc = await geocoder.geocode(zipCode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //Calc radius using raidans. 
    //Divide dist by radius of earth. r= 3963mi or 6378kn
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})