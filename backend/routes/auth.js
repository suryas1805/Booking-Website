const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/UserModal')
const authMiddleware = require('../middleware/authMiddleware')
const logActivity = require('../utils/logActivity')
const Booking = require('../models/BookingModal')
// const upload = require('../middleware/imageUpload')
const upload = require('../middleware/cloudinaryUpload')
const multer = require('multer')
const sendPushNotification = require('../utils/oneSignal')
const Otp = require('otp-generator')
const crypto = require('crypto')
const OtpModal = require('../models/OtpModal')

// User registration
router.post('/register', async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) return res.status(400).json({ msg: 'Email already exists' });

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const newUser = new User(req.body);
        await newUser.save();

        // Send welcome push notification
        await sendPushNotification({
            title: 'Welcome!',
            message: `Hi ${newUser.email}, your account has been created successfully!`,
            userIds: [newUser._id]
        });

        res.status(201).json({ msg: 'User registered successfully', data: { newUser } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Email not found' });

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) return res.status(400).json({ msg: 'Password incorrect' });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Send push notification
        await sendPushNotification({
            title: 'Login Successful',
            message: `Hi ${user.email}, you have logged in successfully.`,
            userIds: [user._id]
        });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// user logout
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const isUser = await User.findById({ _id: req.user.id })

        if (!isUser) return res.status(400).json({ msg: 'User not found' })

        await logActivity({
            user: isUser?._id,
            action: 'User logout',
            description: `User ${isUser?.name} logged out successfully.`,
            type: 'user',
        });

        res.status(200).json({ msg: 'User logged out successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' })
    }
})

//getAll users by admin only
router.get('/users', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Forbidden" })

        const users = await User.find({}, '-password');

        res.status(200).json({ data: users })
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' })
    }
})

//get user by id
router.get('/user/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findOne({ _id: id }, ["-password"])
        if (!user) return res.status(404).json({ msg: "User not found" })

        let bookings = await Booking.find({ user: { _id: id } }).populate('user', '-password').populate({ path: 'products.product', populate: 'category' })

        bookings = bookings ? bookings : []

        res.status(200).json({ data: user, bookings })
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' })
    }
})

//update user details by id
router.put(
    '/user/:id',
    authMiddleware,
    (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ msg: 'Image size should not exceed 5MB' });
                }
                console.error('MulterError:', err);
                return res.status(400).json({ msg: err.message });
            } else if (err) {
                console.error('Upload error details:', err);
                return res.status(500).json({ msg: 'Upload error', error: err });
            }
            next();
        });
    },
    async (req, res) => {
        try {
            const { id } = req.params;

            const updateData = {
                ...req.body
            };

            if (req.file) updateData.image = req.file.path;

            const user = await User.findByIdAndUpdate(id, updateData, { new: true });
            if (!user) return res.status(404).json({ msg: 'User not found' });

            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            await logActivity({
                user: user?._id,
                action: 'User profile update',
                description: `User ${user?.name} updated profile information.`,
                type: 'user',
            });

            return res.status(200).json({
                msg: 'User details updated successfully',
                data: userWithoutPassword,
            });
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ msg: 'Internal Server Error', error: error.message });
        }
    }
);

//delete user details by id
router.delete('/user/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete({ _id: id })
        if (!user) return res.status(404).json({ msg: "User not found" })

        res.status(200).json({ msg: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' })
    }
})

//email verifiy and generate otp and token
router.post('/email-verify', async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ success: false, msg: "User not found with this email" })

        const otp = Otp.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

        const token = crypto.randomBytes(5).toString('hex')

        const existsUserOtp = await OtpModal.findOne({ email })

        if (existsUserOtp) return res.status(200).json({ msg: "Otp already sent to your email" })

        const otpData = await OtpModal.create({ email, otp, token })

        const result = {
            email: otpData.email,
            otp: otpData.otp,
            token: otpData.token
        }
        return res.status(200).json({ msg: "Email verified successfully", data: result })

    } catch (error) {
        res.status(500).json({ success: false, msg: 'Internal Server Error' })
    }
})

//otp verify
router.post('/otp-verify', async (req, res) => {
    try {
        const { email, otp, token } = req.body
        const validEmailandUser = await OtpModal.findOne({ email, otp, token })

        if (!validEmailandUser) return res.status(400).json({ msg: "Otp expired or Invalid Otp" })

        res.status(200).json({ success: true, msg: "Otp verified successfully" })

    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' })
    }
})

//update user password by id
router.put('/change-password', async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body

        if (newPassword !== confirmPassword) return res.status(400).json({ msg: "New Password & Confirm Password not match" })

        const user = await User.findOne({ email })

        if (!user) return res.status(404).json({ msg: "User not found" })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashPassword
        await user.save()

        await logActivity({
            user: user?._id,
            action: 'User password change',
            description: `User ${user?.name} changed their account password successfully.`,
            type: 'user',
        });

        res.status(200).json({ msg: "Password changed successfully" })
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' })
    }
})

module.exports = router