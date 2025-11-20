const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    contact: {
        phone_number: String,
        address: String,
        city: String,
        state: String,
        postal_code: String
    },
    image: { type: String },
    provider: {
        type: String,
        default: 'local'
    },
    googleId: {
        type: String,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
