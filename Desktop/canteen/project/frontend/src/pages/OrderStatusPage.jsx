import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import OrderReceipt from '../components/OrderReceipt'
import { orderAPI } from '../services/api'
import socketService from '../services/socket'

const OrderStatusPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrder()
    
    // Connect to socket for real-time updates
    const socket = socketService.connect()
    
    // Listen for order status updates
    socket.on('orderStatusUpdate', handleStatusUpdate)
    
    return () => {
      socket.off('orderStatusUpdate', handleStatusUpdate)
    }
  }, [orderId])

  const handleStatusUpdate = (data) => {
    if (data.orderId === orderId) {
      setOrder(data.order)
      
      // Show notification for status change
      if (data.status === 'Ready') {
        showNotification('🎉 Your order is ready for pickup!')
      } else if (data.status === 'In Progress') {
        showNotification('👨‍🍳 Your order is being prepared!')
      }
    }
  }

  const showNotification = (message) => {
    // Simple notification - could be enhanced with a proper notification library
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Canteen Order Update', {
        body: message,
        icon: '/favicon.ico'
      })
    }
  }

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderAPI.getById(orderId)
      setOrder(response.data)
    } catch (error) {
      console.error('Error fetching order:', error)
      setError(error.response?.data?.message || 'Order not found')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchOrder()
  }

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary"
            >
              Browse Menu
            </button>
            <button
              onClick={handleRefresh}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/menu')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </button>
          
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 btn-secondary"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Order Status Timeline */}
        <div className="mb-8">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h2>
            
            <div className="flex items-center justify-between">
              {['Pending', 'In Progress', 'Ready', 'Completed'].map((status, index) => {
                const isActive = ['Pending', 'In Progress', 'Ready', 'Completed'].indexOf(order.status) >= index
                const isCurrent = order.status === status
                
                return (
                  <div key={status} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      isActive 
                        ? isCurrent 
                          ? 'bg-primary-600 text-white ring-4 ring-primary-200' 
                          : 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className={`text-sm font-medium ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                      {status}
                    </div>
                    {index < 3 && (
                      <div className={`flex-1 h-1 mx-4 mt-4 ${
                        ['Pending', 'In Progress', 'Ready', 'Completed'].indexOf(order.status) > index 
                          ? 'bg-primary-600' 
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            
            {order.status === 'Ready' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">🎉</div>
                  <div>
                    <div className="font-semibold text-green-800">Your order is ready!</div>
                    <div className="text-green-700">Please collect your order from the canteen counter.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Receipt */}
        <OrderReceipt order={order} />

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/menu')}
            className="btn-secondary mr-4"
          >
            Order More Items
          </button>
          
          {order.status !== 'Completed' && (
            <button
              onClick={handleRefresh}
              className="btn-primary"
            >
              Check Status
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderStatusPage