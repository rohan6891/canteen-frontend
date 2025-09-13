const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

const sampleMenuItems = [
  {
    name: 'Chicken Burger',
    description: 'Juicy grilled chicken breast with lettuce, tomato, and mayo',
    price: 8.99,
    category: 'Lunch',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    preparationTime: 15
  },
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan cheese and croutons',
    price: 6.99,
    category: 'Lunch',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
    preparationTime: 8
  },
  {
    name: 'Pancakes',
    description: 'Fluffy pancakes served with maple syrup and butter',
    price: 5.99,
    category: 'Breakfast',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
    preparationTime: 12
  },
  {
    name: 'Coffee',
    description: 'Freshly brewed coffee',
    price: 2.99,
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg',
    preparationTime: 3
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate frosting',
    price: 4.99,
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    preparationTime: 5
  },
  {
    name: 'French Fries',
    description: 'Crispy golden french fries',
    price: 3.99,
    category: 'Snacks',
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
    preparationTime: 10
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canteen-ordering');
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Insert sample data
    await MenuItem.insertMany(sampleMenuItems);
    console.log('Sample menu items added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();