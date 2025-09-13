import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderStatusPage from './pages/OrderStatusPage'
import TrackOrderPage from './pages/TrackOrderPage'
import DashboardPage from './pages/DashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { AdminProvider } from './context/AdminContext'
import Navigation from './components/Navigation'

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 transition-all duration-500">
              <Navigation />
              <Routes>
                <Route path="/" element={<MenuPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/track-order" element={<TrackOrderPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/order/:orderId" element={<OrderStatusPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </AdminProvider>
    </ThemeProvider>
  )
}

export default App