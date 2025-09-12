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
    required: true,
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
    // Generate unique order number with date and random component
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Format: CN-YYYYMMDD-HHMMSS-XXX (e.g., CN-20241201-143052-123)
    this.orderId = `CN-${dateStr}-${timeStr}-${randomNum}`;
    
    // Calculate estimated time (sum of preparation times + 5 minutes buffer)
    const totalPrepTime = this.items.reduce((total, item) => total + 10, 0); // Default 10 min per item
    this.estimatedTime = new Date(Date.now() + (totalPrepTime + 5) * 60000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);