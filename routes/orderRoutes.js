const express = require('express');
const { createOrder, getAllOrders, getOrder} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:userId', protect, createOrder);
router.get('/', protect, getAllOrders);
router.get('/:id', protect, getOrder); 

module.exports = router;
