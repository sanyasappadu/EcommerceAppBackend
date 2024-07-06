const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const products = req.body.products;
        let totalPrice = 0;
        const orderItems = await Promise.all(products.map(async (item) => {
            const product = await Product.findById(item.productId);
            totalPrice += product.price * item.quantity;
            return {
                product: product._id,
                quantity: item.quantity
            };
        }));

        const order = await Order.create({
            user: user._id,
            products: orderItems,
            totalPrice
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email') // Populate user details
            .populate('products.product', 'name price'); // Populate product details

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
