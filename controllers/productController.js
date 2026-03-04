const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    const { name, price, description, category, stock, image, sizes } = req.body;
    try {
        const product = await Product.create({
            name, price, description, category, stock, image, sizes,
            seller: req.user._id  // from auth middleware
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Make sure only the seller who created it can update it
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createManyProducts = async (req, res) => {
    try {
        const products = req.body.map(product => ({
            ...product,
            seller: req.user._id
        }));
        const created = await Product.insertMany(products);
        res.status(201).json({ count: created.length, products: created });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};