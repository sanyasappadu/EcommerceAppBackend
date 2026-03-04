const FestivalOffer = require('../models/FestivalOffer');

const MONTH_TO_SEASON = {
  0:  'January',
  1:  'February',
  2:  'March',
  3:  'April',
  4:  'May',
  5:  'June',
  6:  'July',
  7:  'August',
  8:  'September',
  9:  'October',
  10: 'November',
  11: 'December',
};

// ── PUBLIC ────────────────────────────────────────────────────────────────────

// GET /api/offers — get all active offers
exports.getAllOffers = async (req, res) => {
  try {
    const now = new Date();
    const offers = await FestivalOffer.find({
      isActive: true,
      $or: [
        { startDate: null, endDate: null },                    // no date restriction
        { startDate: { $lte: now }, endDate: { $gte: now } }, // within date range
        { startDate: null, endDate: { $gte: now } },           // only end date set
        { startDate: { $lte: now }, endDate: null },           // only start date set
      ],
    })
      .select('-createdBy -usageCount -usageLimit -__v')
      .sort({ createdAt: -1 });

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/offers/season — get offer for current month
exports.getOffersBySeason = async (req, res) => {
  try {
    const currentSeason = MONTH_TO_SEASON[new Date().getMonth()];
    const now = new Date();

    const offers = await FestivalOffer.find({
      isActive: true,
      season: { $in: [currentSeason, 'All Year'] },
      $or: [
        { startDate: null, endDate: null },
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: null, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: null },
      ],
    })
      .select('-createdBy -__v')
      .sort({ discount: -1 }); // highest discount first

    if (offers.length === 0) {
      return res.status(200).json({ message: 'No active offers for this season', offers: [] });
    }

    res.status(200).json({ season: currentSeason, offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/offers/validate/:code — validate a coupon code (used by Cart)
exports.validateOfferCode = async (req, res) => {
  try {
    const { code } = req.params;
    const now = new Date();

    const offer = await FestivalOffer.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      $or: [
        { startDate: null, endDate: null },
        { startDate: { $lte: now }, endDate: { $gte: now } },
        { startDate: null, endDate: { $gte: now } },
        { startDate: { $lte: now }, endDate: null },
      ],
    });

    if (!offer) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    // Check usage limit
    if (offer.usageLimit !== null && offer.usageCount >= offer.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    res.status(200).json({
      valid:       true,
      code:        offer.code,
      discount:    offer.discount,
      description: offer.name,
      message:     `✅ ${offer.discount}% off — ${offer.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── SELLER PROTECTED ──────────────────────────────────────────────────────────

// GET /api/offers/my — get all offers created by this seller
exports.getMyOffers = async (req, res) => {
  try {
    const offers = await FestivalOffer.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/offers/:id — get single offer by id (seller only)
exports.getOfferById = async (req, res) => {
  try {
    const offer = await FestivalOffer.findById(req.params.id).populate('createdBy', 'name email');
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Only creator can view full details
    if (offer.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createOffer = async (req, res) => {
  try {
    const {
      name, subtitle, code, discount,
      gradient, accent, emoji, season,
      isActive, startDate, endDate, usageLimit,
    } = req.body;

    if (!name || !subtitle || !code || !discount || !season) {
      return res.status(400).json({ message: 'name, subtitle, code, discount and season are required' });
    }

    const existing = await FestivalOffer.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: `Coupon code "${code.toUpperCase()}" already exists` });
    }

    // ✅ Validate date range if provided
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const offer = await FestivalOffer.create({
      name:       name.trim(),
      subtitle:   subtitle.trim(),
      code:       code.toUpperCase().trim(),
      discount:   Number(discount),
      gradient:   gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent:     accent   || '#ffffff',
      emoji:      Array.isArray(emoji) ? emoji : ['🎉'],
      season,
      isActive:   isActive !== undefined ? isActive : true,
      startDate:  startDate ? new Date(startDate) : null,  // ✅ store as Date
      endDate:    endDate   ? new Date(endDate)   : null,  // ✅ store as Date
      usageLimit: usageLimit ? Number(usageLimit) : null,
      usageCount: 0,
      createdBy:  req.user._id,
    });

    res.status(201).json(offer);
  } catch (error) {
    console.error('createOffer error:', error.message);
    res.status(400).json({ message: error.message });
  }
};
// PUT /api/offers/:id — update offer
exports.updateOffer = async (req, res) => {
  try {
    const offer = await FestivalOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    if (offer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this offer' });
    }

    // If code is being changed, check for duplicates
    if (req.body.code && req.body.code.toUpperCase() !== offer.code) {
      const duplicate = await FestivalOffer.findOne({
        code: req.body.code.toUpperCase().trim()
      });
      if (duplicate) {
        return res.status(400).json({ message: `Code "${req.body.code.toUpperCase()}" already in use` });
      }
      req.body.code = req.body.code.toUpperCase().trim();
    }

    const updated = await FestivalOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PATCH /api/offers/:id/toggle — toggle active/inactive
exports.toggleOfferStatus = async (req, res) => {
  try {
    const offer = await FestivalOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    if (offer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    res.status(200).json({
      message: `Offer ${offer.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: offer.isActive,
      offer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/offers/:id/increment-usage — called when order is placed with this code
exports.incrementUsage = async (req, res) => {
  try {
    const offer = await FestivalOffer.findOneAndUpdate(
      { code: req.body.code?.toUpperCase().trim() },
      { $inc: { usageCount: 1 } },
      { new: true }
    );

    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    res.status(200).json({ usageCount: offer.usageCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/offers/:id — delete offer
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await FestivalOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    if (offer.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this offer' });
    }

    await offer.deleteOne();
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};