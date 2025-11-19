const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const Booking = require('../models/BookingModal')
const User = require('../models/UserModal')
const Cart = require('../models/CartModal')
const router = express.Router()
const crypto = require('crypto')
const logActivity = require('../utils/logActivity')

//create booking by user
router.post('/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params

        const userExists = await User.findById({ _id: userId })
        if (!userExists) return res.status(404).json({ msg: 'User not found' })

        const userCart = await Cart.findOne({ user: userId }).populate('user', '-password').populate('products.product')

        if (!userCart) return res.status(404).json({ msg: "Cart not found" })

        for (let item of userCart.products) {
            if (item.quantity > item.product.stock) {
                return res.status(400).json({ msg: `Insufficient stock for product: ${item.product.name}` })
            }
        }

        for (let item of userCart.products) {
            item.product.stock -= item.quantity
            await item.product.save()
        }

        let bookingId;
        let exists = true;

        while (exists) {
            const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
            bookingId = `BK-${Date.now()}-${randomCode}`;
            exists = await Booking.findOne({ bookingId });
        }

        const newBooking = new Booking({
            user: userId,
            products: userCart.products.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            status: 'pending',
            bookingId
        })
        newBooking.save()

        await logActivity({
            user: userId,
            action: 'Booking Created',
            description: `Created a new booking with ID: ${bookingId}`,
            type: 'booking',
        });

        userCart.products = [];
        userCart.cartsummary = { totalItems: 0, subtotal: 0, discount: 0, shippingcharge: 0, grandtotal: 0 };

        await userCart.save();

        res.status(201).json({ msg: 'Booking added successfully', data: newBooking })

    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

//getAll bookings by admin
router.get('/getAll', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Forbidden" })
        const bookings = await Booking.find()
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate('products.product')
        res.status(200).json({ data: bookings })
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

//getAll bookings by user
router.get('/getAll/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params
        const bookings = await Booking.find({ user: { _id: userId } })
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate({ path: 'products.product', populate: 'category' })
        res.status(200).json({ data: bookings })
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

//update booking by id admin only
router.put('/update/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Forbidden" })

        const { id } = req.params
        const { status, trackingId } = req.body

        const booking = await Booking.findByIdAndUpdate({ _id: id }, { status: status, tracking: { id: trackingId } }, { new: true }).
            populate('user', '-password').populate({ path: 'products.product', populate: { path: 'category' } })

        await logActivity({
            user: booking.user?._id,
            action: 'Booking Updated',
            description: `Booking with ID: ${booking.bookingId} status changed`,
            type: 'booking',
        });

        res.status(200).json({ msg: "Booking status updated", data: booking })
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})


module.exports = router