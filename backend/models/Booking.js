const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Service',
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Technician',
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'cod'], // card for credit card, cod for cash on delivery
  },
  transactionId: {
    type: String,
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      zipCode: String,
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);