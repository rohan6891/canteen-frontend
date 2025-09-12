const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  studentName: {
    type: String,
    default: 'Anonymous'
  },
  mobileNumber: {
    type: String,
    default: ''
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Cash'],
    default: 'UPI'
  },
  estimatedTime: {
    type: Date
  },
  qrCode: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Generate unique order ID
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate shorter, user-friendly order ID
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const randomNum = Math.floor(Math.random() * 999) + 1; // 1-999
    
    // Format: CN + day of year (3 digits) + random number (3 digits)
    // Example: CN001234, CN365999 (max 8 characters)
    this.orderId = `CN${dayOfYear.toString().padStart(3, '0')}${randomNum.toString().padStart(3, '0')}`;
    
    // Calculate estimated time (sum of preparation times + 5 minutes buffer)
    const totalPrepTime = this.items.reduce((total, item) => total + 10, 0); // Default 10 min per item
    this.estimatedTime = new Date(Date.now() + (totalPrepTime + 5) * 60000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);