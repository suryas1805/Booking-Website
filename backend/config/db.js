const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('MongoDB connected')
    } catch (error) {
        console.log('Error while connecting DB:', error)
        process.exit(1)
    }
}

module.exports = connectDB