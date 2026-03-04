const FestivalOffer = require('../models/FestivalOffer');

// POST /api/coupons/validate — now reads from DB
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const now = new Date();
    const offer = await FestivalOffer.findOne({
      code:     code.toUpperCase().trim(),
      isActive: true,
      $or: [
        { startDate: null, endDate: null },
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: null, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: null },
      ],
    });

    if (!offer) return res.status(404).json({ message: 'Invalid or expired coupon code' });

    if (offer.usageLimit !== null && offer.usageCount >= offer.usageLimit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    res.status(200).json({
      valid:       true,
      code:        offer.code,
      discount:    offer.discount,
      description: offer.name,
      isCurrentMonth: true,
      message:     `✅ ${offer.discount}% off — ${offer.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons/current — current month's best offer
exports.getCurrentCoupon = async (req, res) => {
  try {
    const MONTHS = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const currentSeason = MONTHS[new Date().getMonth()];
    const now = new Date();

    const offer = await FestivalOffer.findOne({
      isActive: true,
      season: { $in: [currentSeason, 'All Year'] },
      $or: [
        { startDate: null, endDate: null },
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: null, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: null },
      ],
    }).sort({ discount: -1 }); // highest discount

    if (!offer) return res.status(200).json(null);

    res.status(200).json({
      code:     offer.code,
      discount: offer.discount,
      description: offer.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};