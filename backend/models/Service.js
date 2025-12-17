const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detailedDescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
  }],
  benefits: [{
    type: String,
  }],
  faqs: [{
    question: String,
    answer: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);