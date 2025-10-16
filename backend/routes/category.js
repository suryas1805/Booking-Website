const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const Category = require('../models/CategoryModal')

//create category
router.post('/create', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Forbidden" })
        const { name } = req.body

        const categoryExist = await Category.findOne({ name })
        if (categoryExist) return res.status(400).json({ msg: "Category name already exists" })

        const newCategory = new Category({ name })
        newCategory.save()

        res.status(201).json({ msg: "Category added successfully", newCategory })

    } catch (error) {
        res.status(500).status({ msg: "Internal Server Error" })
    }
})

//getall category
router.get('/getAll', authMiddleware, async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json({ data: categories })
    } catch (error) {
        res.status(500).status({ msg: "Internal Server Error" })
    }
})

//getbyId category
router.get('/get/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findOne({ _id: id })

        if (!category) return res.status(404).json({ msg: 'Category not found' })

        res.status(200).json({ data: category })
    } catch (error) {
        res.status(500).status({ msg: "Internal Server Error" })
    }
})

//update by Id category admin only
router.put('/update/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Forbidden" })

        const { id } = req.params
        const category = await Category.findByIdAndUpdate({ _id: id }, req.body, { new: true })

        if (!category) return res.status(404).json({ msg: 'Category not found' })

        res.status(200).json({ msg: "Category updated successfully", data: category })
    } catch (error) {
        res.status(500).status({ msg: "Internal Server Error" })
    }
})

//delete by Id category admin only
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ msg: "Forbidden" })

        const { id } = req.params
        const category = await Category.findByIdAndDelete({ _id: id })

        if (!category) return res.status(404).json({ msg: 'Category not found' })

        res.status(200).json({ msg: "Category deleted successfully" })
    } catch (error) {
        res.status(500).status({ msg: "Internal Server Error" })
    }
})

module.exports = router