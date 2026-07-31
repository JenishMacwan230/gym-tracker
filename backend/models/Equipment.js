const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  serialNumber: { type: String, default: '' },
  category: { type: String, enum: ['Cardio', 'Strength', 'Free Weights', 'Functional', 'Recovery', 'Facilities', 'Other'], default: 'Strength' },
  location: { type: String, default: 'Main Floor' },
  imageUrl: { type: String, default: '' },
  lastServiced: { type: Date, default: Date.now },
  serviceIntervalDays: { type: Number, default: 90 },
  status: { type: String, enum: ['Operational', 'Maintenance Needed', 'Out of Service'], default: 'Operational' },
  notes: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Service overdue calculation
equipmentSchema.virtual('nextServiceDate').get(function () {
  if (!this.lastServiced) return new Date();
  const next = new Date(this.lastServiced);
  next.setDate(next.getDate() + (this.serviceIntervalDays || 90));
  return next;
});

equipmentSchema.virtual('needsService').get(function () {
  return this.status === 'Maintenance Needed' || new Date() > this.nextServiceDate;
});

equipmentSchema.virtual('daysUntilService').get(function () {
  const diffTime = this.nextServiceDate - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Equipment', equipmentSchema);