const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const bookingRoutes = require('./routes/booking')
const cartRoutes = require('./routes/cart')
const activityRoute = require('./routes/activity')
const reportRoute = require('./routes/reports')
// const path = require('path')
// const fs = require('fs');

connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json())

// const uploadPath = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }

// app.use('/uploads', express.static(uploadPath))
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/activity', activityRoute)
app.use('/api/reports', reportRoute)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})