const mongoose = require('mongoose')


const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    cartsummary: {
        totalItems: {
            type: Number,
            default: 0
        },
        subtotal: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        shippingcharge: {
            type: Number,
            default: 0
        },
        grandtotal: {
            type: Number,
            default: 0
        }
    }
})

module.exports = mongoose.model('Cart', CartSchema)