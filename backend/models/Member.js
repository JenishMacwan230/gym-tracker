const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  planType: { type: String, enum: ['Monthly', 'Quarterly', 'Annual', 'Custom'], default: 'Monthly' },
  startDate: { type: Date, default: Date.now },
  durationMonths: { type: Number, required: true, default: 1 },
  lastPaymentDate: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Dynamic expiration calculation
memberSchema.virtual('expirationDate').get(function () {
  if (!this.lastPaymentDate) return new Date();
  const exp = new Date(this.lastPaymentDate);
  exp.setMonth(exp.getMonth() + (this.durationMonths || 1));
  return exp;
});

// Expiration status badge logic
memberSchema.virtual('isExpired').get(function () {
  return new Date() > this.expirationDate;
});

// Days remaining calculation
memberSchema.virtual('daysRemaining').get(function () {
  const diffTime = this.expirationDate - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Member', memberSchema);