const ErrorResponse = require('../utils/errorResponse')

const errorHanlder = (err, req, res, next) => {
    let error = { ...err }

    error.message = err.message

    //Log to Console for Dev 
    console.log(err)

    //Mongoose Bad Object ID
    if (err.name === 'CastError') {
        const message = `Bootcamp not found with ID of: ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    //Mongoos Duplicate Key 
    if (err.code === 11000) {
        const message = 'Duplicate field value entered, splea'
        error = new ErrorResponse(message, 400)
    }

    //Mongoos Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }
    res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' })
}

module.exports = errorHanlder