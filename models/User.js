const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto =require( 'crypto')

const UserSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email.'],
        unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email.'
        ]
    },
    role: {
        type: String, 
        enum: ['user', 'publisher'], 
        default: 'user'
    },
    password: {
        type: String, 
        required: [true, 'Please provide a password.'], 
        minlength: 5, 
        select: false, 
    },
    resetPasswordToken: {
        type: String,
    }, 
    resetPasswordExpire: {
        type: Date
    }, 
    createdAt: {
        type: Date, 
        default: Date.now
    }
    
})

//Encrypt pass using bycrypt
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)

})

//Sign the JWT
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({ id: this._id },process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    } )
}
  //Match user entered password to hashed password in database.
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Generate and Hash password token.
UserSchema.methods.getResetPasswordToken = function(){
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //Hash Token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    //Set Expire
    this.resetPasswordExpire = Date.now() + (10 * 60 * 1000); 

    return resetToken
}

module.exports = mongoose.model('User', UserSchema)