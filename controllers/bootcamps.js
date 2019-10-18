
// @desc    Get All Bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public 
exports.getBootcamps = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: 'Show all bootcamps' })
}

// @desc    Get Single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public 
exports.getBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: `Get Bootcamp ${req.params.id}` })
}

// @desc    Create New Bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private 
exports.createBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: 'Create New Bootcamp' })
}

// @desc    Update Single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private 
exports.updateBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: `Update Bootcamp ${req.params.id}` })
}

// @desc    Delete Single Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private 
exports.deleteBootcamp = (req, res, next) => {
    res
        .status(200)
        .json({ success: true, msg: `Delete Bootcamp ${req.params.id}` })
}