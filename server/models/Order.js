const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: { type: String, default: () => require('uuid').v4() },
  customerId: { type: String, ref: 'User', required: true },
  driverId: { type: String, ref: 'User', default: null },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  pickupAddress: { type: String, required: true },
  pickupCity: { type: String, default: 'Zurich' },
  pickupPostalCode: String,
  destinationAddress: { type: String, required: true },
  destinationCity: { type: String, default: 'Zurich' },
  destinationPostalCode: String,
  pickupDateTime: { type: Date, required: true },
  flightNumber: String,
  airline: String,
  passengerCount: { type: Number, required: true, min: 1, max: 8 },
  luggageCount: { type: Number, default: 0, min: 0, max: 8 },
  specialRequirements: String,
  notes: String,
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedPrice: { type: Number, required: true },
  finalPrice: Number,
  acceptedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// 添加索引以提高查询性能
orderSchema.index({ customerId: 1 });
orderSchema.index({ driverId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ pickupDateTime: 1 });

module.exports = mongoose.model('Order', orderSchema);
