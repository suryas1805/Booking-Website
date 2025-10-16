const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    contact: {
        phone_number: String,
        address: String,
        city: String,
        state: String,
        postal_code: String
    },
    image: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
