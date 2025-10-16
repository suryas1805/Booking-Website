const express = require('express')
const router = express.Router()
const Cart = require('../models/CartModal')
const User = require('../models/UserModal')
const Product = require('../models/ProductModal')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params

        const cartByUserId = await Cart.findOne({ user: userId }).populate('products.product').populate('user')

        if (!cartByUserId) return res.status(404).json({ msg: "No carts found" })

        res.status(200).json({ data: cartByUserId })
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})

//add or update cart
router.post('/:userId', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params
        const { productId, quantity } = req.body

        const product = await Product.findById({ _id: productId })
        if (!product) return res.status(404).json({ msg: "Product not found" })

        const userExists = await User.findById({ _id: userId })
        if (!userExists) return res.status(404).json({ msg: "User not found" })

        let cart = await Cart.findOne({ user: userId })

        if (!cart) {
            cart = new Cart({
                user: userId,
                products: [{
                    product: productId,
                    quantity,
                    subtotal: product.price * quantity
                }],
                cartsummary: {
                    totalItems: quantity,
                    subtotal: product.price * quantity,
                    grandtotal: product.price * quantity
                }
            })
        } else {
            const existingProduct = cart.products.find((p) => p.product.toString() === productId)

            if (existingProduct) {
                if (req.body.type === 'update quantity') {
                    existingProduct.quantity = quantity
                } else {
                    existingProduct.quantity += quantity
                }
                existingProduct.subtotal = existingProduct.quantity * product.price
            } else {
                cart.products.push({
                    product: productId,
                    quantity,
                    subtotal: product.price * quantity
                })
            }
        }

        let totalItems = 0
        let subtotal = 0

        cart.products.forEach((p) => {
            totalItems += p.quantity
            subtotal += p.subtotal
        });

        cart.cartsummary.totalItems = totalItems
        cart.cartsummary.subtotal = subtotal
        cart.cartsummary.grandtotal = subtotal - cart.cartsummary.discount + cart.cartsummary.shippingcharge

        await cart.save()
        res.status(200).json({ msg: "Cart updated successfully", data: cart })

    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})


router.delete('/:userId/:productId', authMiddleware, async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });

        const existingProduct = cart.products.find((p) => p.product.toString() === productId);
        if (!existingProduct) return res.status(404).json({ msg: "Product not found" });

        cart.products = cart.products.filter((p) => p.product.toString() !== productId);

        let totalItems = 0;
        let subtotal = 0;
        cart.products.forEach((p) => {
            totalItems += p.quantity;
            subtotal += p.subtotal;
        });

        cart.cartsummary.totalItems = totalItems;
        cart.cartsummary.subtotal = subtotal;
        cart.cartsummary.grandtotal = subtotal - (cart.cartsummary.discount || 0) + (cart.cartsummary.shippingcharge || 0);

        await cart.save();

        res.status(200).json({ msg: "Product removed from cart", data: cart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});


module.exports = router