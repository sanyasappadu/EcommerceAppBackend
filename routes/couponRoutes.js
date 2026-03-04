const express = require('express');
const { validateCoupon, getCurrentCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/current', protect, getCurrentCoupon);

module.exports = router;