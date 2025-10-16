const Activity = require('../models/ActivityModal');

const logActivity = async ({ user, action, description, type, metadata = {} }) => {
    try {
        const activity = new Activity({
            user,
            action,
            description,
            type,
            metadata
        });
        await activity.save();
    } catch (error) {
        console.log('Error saving activity:', error.message);
    }
};

module.exports = logActivity
