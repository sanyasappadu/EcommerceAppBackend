// userRoutes.js — ✅ specific routes FIRST, generic /:id LAST
const express = require('express');
const { getUserById, addToWishlist, addToCart, getWishList, getCart, removeFromWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Specific routes first
router.post('/wishlist/:id', protect, addToWishlist);
router.get('/wishlist/:id', protect, getWishList);
router.post('/cart/:id', protect, addToCart);
router.get('/cart/:id', protect, getCart);
router.delete('/:id/wishlist', protect, removeFromWishlist);

// Generic /:id route LAST — otherwise it swallows all routes above
router.get('/:id', protect, getUserById);

module.exports = router;