const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const path = require('path')

// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = asyncHandler(async (req, res, next) => {
   

    res.status(200).json(res.advancedResults) //aR is available on res because it was put there by earlier middleware ()
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
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
    }
    bootcamp.remove()
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


// @desc    Upload photo for Bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private 
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
    }

     if(!req.files){
         return next(new ErrorResponse(`Please Upload a file`, 400))
     }

    const file = req.files.file; 
    //Validate is Photo.
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Incorrect filetype. Please upload an image file`, 400))
    }
    //Validate size. 
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`))
    }

    //create unique filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err)=>{
        if(err){
            console.error(err)
            return next(new ErrorResponse(`There was a problem with file upload.`,500))
        }
        await Bootcamp.findById(req.params.id, {
            photo: file.name
        })
        res.status(200).json({success: true, data: file.name})
    })
})