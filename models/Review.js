const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review.'],
        maxLength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add a review']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 10'], 
        minimum: 1 , 
        maximum: 10
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }

})
module.exports = mongoose.model('Review', ReviewSchema)