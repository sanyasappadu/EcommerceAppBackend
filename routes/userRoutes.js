const express = require('express');
const { getUserById, addToWishlist, addToCart, getWishList, getCart } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:id', protect, getUserById);
router.post('/wishlist/:id', protect,  addToWishlist);
router.post('/cart/:id', protect,  addToCart);
router.get('/wishlist/:id', protect, getWishList);
router.get('/cart/:id', protect, getCart);

module.exports = router;

