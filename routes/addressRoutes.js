const express = require('express');
const router = express.Router();
const {
    createAddress,
    getAllAddresses,
    updateAddress,
    makeDefaultAddress,
    deleteAddress
} = require('../controllers/addressController');
const { protect, buyerOnly } = require('../middleware/authMiddleware');

router.use(protect, buyerOnly); // All address routes are buyer only

router.post('/', createAddress);
router.get('/', getAllAddresses);
router.put('/:id', updateAddress);
router.patch('/:id/default', makeDefaultAddress);
router.delete('/:id', deleteAddress);

module.exports = router;