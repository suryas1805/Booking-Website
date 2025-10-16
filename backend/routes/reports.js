const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const Booking = require('../models/BookingModal')
const Product = require('../models/ProductModal')
const User = require('../models/UserModal')
const Activity = require('../models/ActivityModal')

const router = express.Router()

//get user dashboard reports
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params

        const userExists = await User.findById(userId)
        if (!userExists) return res.status(404).json({ msg: "User not found" })

        const userBookings = await Booking.find({ user: userId }).sort({ createdAt: -1 }).limit(3)
        if (!userBookings) return res.status(404).json({ msg: "Bookings not found" })

        const products = await Product.find().sort({ createdAt: -1 }).limit(4)

        res.status(200).json({ data: { bookings: userBookings || [], newProducts: products || [] } })

    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

//get admin dashboard reports
router.get('/admin/:adminId', authMiddleware, async (req, res) => {
    try {
        const { adminId } = req.params;

        const adminExists = await User.findById(adminId);
        if (!adminExists) return res.status(404).json({ msg: "Admin not found" });
        if (adminExists.role !== 'admin') return res.status(403).json({ msg: "Forbidden" });

        const totalBookings = await Booking.find();
        const totalUsers = await User.find({ role: 'user' }, '-password');
        const totalProducts = await Product.find();

        // Calculate total revenue
        const totalRevenue = totalBookings.reduce((acc, booking) => {
            if (!Array.isArray(booking.products)) return acc;
            return acc + booking.products.reduce((sum, p) => sum + (Number(p.subtotal) || 0), 0);
        }, 0);

        let completedBookings = totalBookings.filter((b) => b.status === 'completed').length || 0
        let pendingBookings = totalBookings.filter((b) => b.status === 'pending').length || 0
        let cancelledBookings = totalBookings.filter((b) => b.status === 'cancelled').length || 0

        const bookingsStatus = { labels: ['Completed', 'Pending', 'Cancelled'], data: [completedBookings, pendingBookings, cancelledBookings] }

        // Initialize month-wise data arrays
        const months = Array.from({ length: 12 }, (_, i) => i);
        const bookingsMonthWise = Array(12).fill(0);
        const usersMonthWise = Array(12).fill(0);
        const revenueMonthWise = Array(12).fill(0);

        // Current year
        const currentYear = new Date().getFullYear();

        // Compute bookings month-wise
        totalBookings.forEach((booking) => {
            const date = new Date(booking.bookingDate);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                bookingsMonthWise[month] += 1;

                if (Array.isArray(booking.products)) {
                    const bookingRevenue = booking.products.reduce((sum, p) => sum + (Number(p.subtotal) || 0), 0);
                    revenueMonthWise[month] += bookingRevenue;
                }
            }
        });

        // Compute users month-wise (based on createdAt)
        totalUsers.forEach((user) => {
            const date = new Date(user.createdAt);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                usersMonthWise[month] += 1;
            }
        });

        const recentActivities = await Activity.find().sort({ createdAt: -1 }).limit(5)

        res.status(200).json({
            success: true,
            msg: "Dashboard data fetched successfully",
            data: {
                totalBookings: totalBookings.length,
                totalUsers: totalUsers.length,
                totalProducts: totalProducts.length,
                totalRevenue,
                bookingsStatus,
                monthWise: {
                    bookings: bookingsMonthWise,
                    users: usersMonthWise,
                    revenue: revenueMonthWise,
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                },
                recentActivities
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});


module.exports = router