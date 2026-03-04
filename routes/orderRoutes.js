const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder
} = require('../controllers/orderController');
const { protect, buyerOnly } = require('../middleware/authMiddleware');

router.post('/',           protect, buyerOnly, createOrder);  // ✅ protect is required
router.get('/my-orders',   protect, buyerOnly, getMyOrders);
router.get('/',            protect, getAllOrders);
router.get('/:id',         protect, getOrder);

module.exports = router;