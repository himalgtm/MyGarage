const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  username: { type: String, required: true },
  make: String,
  model: String,
  year: Number,
  engine: String,
  vin: String,
  mileage: Number,
  lastService: Date,
  fuelType: String,
  registrationExpiry: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema);
