const mongoose = require('mongoose')

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 90
    }
})

module.exports = mongoose.model('OTP', OtpSchema)