const express = require('express');
const Activity = require('../models/ActivityModal.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json({ data: activities });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params
        const activities = await Activity.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json({ data: activities });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
