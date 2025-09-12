const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide item price'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide item category'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts']
  },
  image: {
    type: String,
    default: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 10, // in minutes
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);