const express = require('express');
const router  = express.Router();
const {
  getAllOffers,
  getOffersBySeason,
  validateOfferCode,
  getMyOffers,
  getOfferById,
  createOffer,
  updateOffer,
  toggleOfferStatus,
  incrementUsage,
  deleteOffer,
} = require('../controllers/festivalOfferController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');

// ── PUBLIC endpoints ───────────────────────────────────────
router.get('/',                  getAllOffers);        // all active offers
router.get('/season',            getOffersBySeason);  // current month's offers
router.get('/validate/:code',    validateOfferCode);  // validate coupon code

// ── SELLER PROTECTED endpoints ─────────────────────────────
router.get('/my',                protect, sellerOnly, getMyOffers);       // seller's own offers
router.post('/',                 protect, sellerOnly, createOffer);       // create offer
router.get('/:id',               protect, sellerOnly, getOfferById);      // get single offer
router.put('/:id',               protect, sellerOnly, updateOffer);       // update offer
router.patch('/:id/toggle',      protect, sellerOnly, toggleOfferStatus); // toggle active
router.patch('/increment-usage', protect,             incrementUsage);    // track usage
router.delete('/:id',            protect, sellerOnly, deleteOffer);       // delete offer

module.exports = router;