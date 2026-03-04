const mongoose = require('mongoose');

const festivalOfferSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  gradient: {
    type: String,
    required: true,
  },
  accent: {
    type: String,
    required: true,
    default: '#ffffff',
  },
  emoji: {
    type: [String],
    default: ['🎉'],
  },
  season: {
    type: String,
    required: true,
    enum: [
      'January',   // New Year
      'February',  // Valentine's
      'March',     // Holi / Spring
      'April',     // Spring Sale
      'May',       // Eid / Mother's Day
      'June',      // Summer
      'July',      // Independence Day
      'August',    // Raksha Bandhan
      'September', // Ganesh Chaturthi
      'October',   // Navratri / Halloween
      'November',  // Diwali / Black Friday
      'December',  // Christmas
      'All Year',  // Always active
    ],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  usageLimit: {
    type: Number,
    default: null, // null = unlimited
  },
}, { timestamps: true });

// Index for fast season lookups
festivalOfferSchema.index({ season: 1, isActive: 1 });
festivalOfferSchema.index({ code: 1 });

const FestivalOffer = mongoose.model('FestivalOffer', festivalOfferSchema);
module.exports = FestivalOffer;