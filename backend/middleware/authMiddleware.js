const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) return res.status(401).json({ success: false, msg: 'No token provided' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' })
    }
}

module.exports = authMiddleware