const express = require('express');
const { getUserById, addToWishlist, addToCart, getWishList, getCart } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:id', getUserById);
router.post('/wishlist/:id', addToWishlist);
router.post('/cart/:id', addToCart);
router.get('/wishlist/:id', getWishList);
router.get('/cart/:id', getCart);

module.exports = router;

