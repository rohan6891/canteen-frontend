const express = require('express');
const router = express.Router();
const {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

// @route   GET /api/menu
// @desc    Get all menu items
router.get('/', getAllMenuItems);

// @route   POST /api/menu
// @desc    Add new menu item
router.post('/', addMenuItem);

// @route   PUT /api/menu/:id
// @desc    Update menu item
router.put('/:id', updateMenuItem);

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
router.delete('/:id', deleteMenuItem);

module.exports = router;