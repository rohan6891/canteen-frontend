const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { generateQRCode } = require('../utils/generateQR');
const { generatePDF } = require('../utils/generatePDF');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { items, studentName, mobileNumber, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItemId}` });
      }
      if (!menuItem.isAvailable && !menuItem.available) {
        return res.status(400).json({ message: `Item not available: ${menuItem.name}` });
      }

      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    // Create order
    const order = new Order({
      studentName: studentName || 'Anonymous',
      mobileNumber: mobileNumber || '',
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      notes: notes || ''
    });

    await order.save();

    // Generate QR code
    const qrCode = await generateQRCode(`${process.env.FRONTEND_URL}/order/${order.orderId}`);
    order.qrCode = qrCode;
    await order.save();

    // Emit real-time update
    req.io.emit('newOrder', order);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.menuItem')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Ready', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    ).populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit real-time update
    req.io.emit('orderStatusUpdate', { orderId, status, order });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate PDF receipt
const generateReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const pdfBuffer = await generatePDF(order);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="order-${orderId}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate receipt error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  generateReceipt
};