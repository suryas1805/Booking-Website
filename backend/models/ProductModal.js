const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String },
    price: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)