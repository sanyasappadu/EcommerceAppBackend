const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ message: 'User not found' });
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

exports.sellerOnly = (req, res, next) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied. Sellers only.' });
    }
    next();
};

exports.buyerOnly = (req, res, next) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).json({ message: 'Access denied. Buyers only.' });
    }
    next();
};