const mongoose = require('mongoose');

const driverInfoSchema = new mongoose.Schema({
  licenseNumber: String,
  vehicleMake: String,
  vehicleModel: String,
  vehicleYear: Number,
  vehicleColor: String,
  vehiclePlate: String,
  vehicleCapacity: { type: Number, default: 4 },
  rating: { type: Number, default: 5.0 },
  totalTrips: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
});

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => require('uuid').v4() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['customer', 'driver'] },
  driverInfo: driverInfoSchema
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
