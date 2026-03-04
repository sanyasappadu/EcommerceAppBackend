const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, createManyProducts } = require('../controllers/productController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');
// Public / Buyer routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Seller only routes
router.post('/', protect, sellerOnly, createProduct);
router.put('/:id', protect, sellerOnly, updateProduct);
router.delete('/:id', protect, sellerOnly, deleteProduct);
router.post('/bulk', protect, sellerOnly, createManyProducts);


module.exports = router;