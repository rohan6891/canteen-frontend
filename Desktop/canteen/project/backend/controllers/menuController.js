const MenuItem = require('../models/MenuItem');

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const { category, available } = req.query;
    
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new menu item
const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, preparationTime } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const menuItem = new MenuItem({
      name,
      description: description || '',
      price,
      category,
      image: image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      preparationTime: preparationTime || 10
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const menuItem = await MenuItem.findByIdAndUpdate(id, updates, { new: true });
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const menuItem = await MenuItem.findByIdAndDelete(id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
};