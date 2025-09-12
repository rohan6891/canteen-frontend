const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  generateReceipt
} = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Create new order
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Get all orders
router.get('/', getAllOrders);

// @route   GET /api/orders/:orderId
// @desc    Get order by ID
router.get('/:orderId', getOrder);

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status
router.put('/:orderId/status', updateOrderStatus);

// @route   GET /api/orders/:orderId/receipt
// @desc    Generate PDF receipt
router.get('/:orderId/receipt', generateReceipt);

module.exports = router;