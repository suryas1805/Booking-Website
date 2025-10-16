const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    tracking: {
        id: {
            type: String,
            default: ''
        },
    },
    bookingId: {
        type: String,
        required: true,
        unique: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)