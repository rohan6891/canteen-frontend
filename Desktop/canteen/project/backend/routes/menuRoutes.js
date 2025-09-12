const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
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
router.post('/', upload.single('image'), addMenuItem);

// @route   PUT /api/menu/:id
// @desc    Update menu item
router.put('/:id', upload.single('image'), updateMenuItem);

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
router.delete('/:id', deleteMenuItem);

module.exports = router;