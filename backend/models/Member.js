const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  durationMonths: { type: Number, required: true },
  lastPaymentDate: { type: Date, default: Date.now },
});

// Dynamic expiration calculation
memberSchema.virtual('expirationDate').get(function () {
  const exp = new Date(this.lastPaymentDate);
  exp.setMonth(exp.getMonth() + this.durationMonths);
  return exp;
});

// Expiration status badge logic
memberSchema.virtual('isExpired').get(function () {
  return new Date() > this.expirationDate;
});

memberSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Member', memberSchema);