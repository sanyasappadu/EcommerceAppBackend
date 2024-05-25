const express = require('express');
const { createOrder, getAllOrders, getOrder} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:id', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrder); 

module.exports = router;
