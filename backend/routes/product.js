const express = require('express');
const Product = require('../models/ProductModal');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/cloudinaryUpload');
const router = express.Router();
const multer = require('multer');

// Create product
router.post(
    '/create',
    authMiddleware,
    (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ msg: 'Image size should not exceed 5MB' });
                }
                return res.status(400).json({ msg: err.message });
            } else if (err) {
                return res.status(500).json({ msg: 'Upload error', error: err.message });
            }
            next();
        });
    },
    async (req, res) => {
        try {
            if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });

            const { name, description, category, price, stock } = req.body;

            const imageUrl = req.file ? req.file.path : null;

            const newProduct = new Product({
                name,
                description,
                category,
                price,
                stock,
                image: imageUrl,
            });

            await newProduct.save();

            res.status(201).json({ msg: 'Product added successfully', newProduct });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ msg: 'Internal Server Error', error: error.message });
        }
    }
);

// Get all products
router.get('/getAll', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// Get product by ID
router.get('/get/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id }).populate('category');

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        res.status(200).json({ data: product });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

// Update product
router.put(
    '/update/:id',
    authMiddleware,
    (req, res, next) => {
        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ msg: 'Image size should not exceed 5MB' });
                }
                return res.status(400).json({ msg: err.message });
            } else if (err) {
                return res.status(500).json({ msg: 'Upload error', error: err.message });
            }
            next();
        });
    },
    async (req, res) => {
        try {
            if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });

            const { id } = req.params;
            const updateData = { ...req.body };

            if (req.file) {
                updateData.image = req.file.path;
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

            res.status(200).json({ msg: 'Product updated successfully', updatedProduct });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ msg: 'Internal Server Error', error: error.message });
        }
    }
);

// Delete product
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });

        const { id } = req.params;
        await Product.findByIdAndDelete({ _id: id });

        res.status(200).json({ msg: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

module.exports = router;
