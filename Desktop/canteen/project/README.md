# Canteen Ordering System

A full-stack web application for canteen ordering with real-time order tracking, built with React, Express.js, and MongoDB.

## Features

### Student Features
- 🍕 Browse menu with categories and search
- 🛒 Add items to cart with quantity selection
- 💳 Multiple payment options (UPI, Card, Cash)
- 📱 QR code generation for easy order tracking
- 📄 PDF receipt generation and download
- 🔄 Real-time order status updates
- 📱 Mobile-responsive design

### Canteen Staff Features
- 📊 Real-time dashboard with order statistics
- 🔄 Order status management (Pending → In Progress → Ready → Completed)
- 📋 Filter orders by status
- 🔔 Real-time notifications for new orders
- 📈 Daily revenue tracking

## Tech Stack

### Frontend
- **React 18** with hooks and context API
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Socket.io Client** for real-time updates
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **QRCode** for QR code generation
- **PDFKit** for PDF receipt generation
- **CORS** for cross-origin requests

## Project Structure

```
canteen-ordering-system/
│
├── backend/
│   ├── config/db.js              # Database configuration
│   ├── controllers/
│   │   ├── orderController.js    # Order management logic
│   │   └── menuController.js     # Menu management logic
│   ├── models/
│   │   ├── Order.js             # Order data model
│   │   └── MenuItem.js          # Menu item data model
│   ├── routes/
│   │   ├── orderRoutes.js       # Order API routes
│   │   └── menuRoutes.js        # Menu API routes
│   ├── utils/
│   │   ├── generateQR.js        # QR code generation
│   │   └── generatePDF.js       # PDF receipt generation
│   ├── server.js                # Express server setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MenuItemCard.jsx      # Menu item display
│   │   │   ├── OrderReceipt.jsx      # Order receipt component
│   │   │   ├── DashboardTable.jsx    # Orders table for dashboard
│   │   │   └── Navigation.jsx        # Navigation component
│   │   ├── pages/
│   │   │   ├── MenuPage.jsx          # Menu browsing page
│   │   │   ├── CartPage.jsx          # Shopping cart page
│   │   │   ├── OrderStatusPage.jsx   # Order tracking page
│   │   │   └── DashboardPage.jsx     # Staff dashboard
│   │   ├── context/
│   │   │   └── CartContext.jsx       # Cart state management
│   │   ├── services/
│   │   │   ├── api.js               # API client setup
│   │   │   └── socket.js            # Socket.io client
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React entry point
│   └── package.json
│
├── .env                         # Environment variables
├── package.json                 # Root package.json with scripts
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm package manager

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd canteen-ordering-system

# Install root dependencies
npm install

# Install backend dependencies
npm run install-backend

# Install frontend dependencies
npm run install-frontend
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/canteen-ordering
DB_NAME=canteen-ordering

# Server
PORT=5000
NODE_ENV=development

# JWT (for future auth features)
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections on first run.

### 4. Run the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
# Backend only (http://localhost:5000)
npm run server

# Frontend only (http://localhost:5173)
npm run client
```

## API Endpoints

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (with optional filters)
- `GET /api/orders/:orderId` - Get specific order details
- `PUT /api/orders/:orderId/status` - Update order status
- `GET /api/orders/:orderId/receipt` - Download PDF receipt

## Usage Flow

### For Students:
1. **Browse Menu** - Visit the menu page to see available items
2. **Add to Cart** - Select items and quantities to add to cart
3. **Checkout** - Fill in optional details and choose payment method
4. **Order Placed** - Receive order ID and QR code
5. **Track Order** - Monitor real-time status updates
6. **Pickup** - Collect order when status changes to "Ready"

### For Canteen Staff:
1. **Dashboard** - Monitor all orders and statistics
2. **Process Orders** - Update order status as items are prepared
3. **Real-time Updates** - Receive notifications for new orders
4. **Order Completion** - Mark orders as completed when picked up

## Real-time Features

The application uses Socket.io for real-time communication:
- **New Order Notifications** - Staff receive instant notifications
- **Status Updates** - Students see order progress in real-time
- **Dashboard Updates** - Statistics update automatically

## Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (phones)
- 📱 Tablets
- 💻 Desktop computers

## Future Enhancements

- 🔐 Authentication system for staff
- 💳 Payment gateway integration (Stripe/Razorpay)
- 📊 Advanced analytics and reporting
- 🔔 Push notifications
- 📧 Email receipts
- 🏪 Multi-location support
- 📝 Order modification features
- ⭐ Rating and review system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please create an issue in the repository or contact the development team.

---

**Happy Coding! 🚀**