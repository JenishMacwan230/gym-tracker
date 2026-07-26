const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: 'Main Floor' },
  lastServiced: { type: Date, default: Date.now },
  serviceIntervalDays: { type: Number, default: 90 },
});

// Service overdue calculation
equipmentSchema.virtual('nextServiceDate').get(function () {
  const next = new Date(this.lastServiced);
  next.setDate(next.getDate() + this.serviceIntervalDays);
  return next;
});

equipmentSchema.virtual('needsService').get(function () {
  return new Date() > this.nextServiceDate;
});

equipmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Equipment', equipmentSchema);