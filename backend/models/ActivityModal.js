const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        action: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        type: {
            type: String,
            enum: ['booking', 'cart', 'user', 'product', 'system'],
            default: 'system'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
