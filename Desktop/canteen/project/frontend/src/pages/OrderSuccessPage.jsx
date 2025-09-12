import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, Home, ShoppingBag } from 'lucide-react'
import BillDownload from '../components/BillDownload'

const OrderSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { order } = location.state || {}

  if (!order) {
    navigate('/menu')
    return null
  }

  // Store the order ID in localStorage for easy tracking
  React.useEffect(() => {
    if (order && order.orderId) {
      localStorage.setItem('currentOrderId', order.orderId)
    }
  }, [order])

  const handleDownloadBill = () => {
    // This will be handled by the BillDownload component
    const billDownload = document.querySelector('#bill-download')
    if (billDownload) {
      billDownload.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Thank you for your order. Your delicious meal is being prepared.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-dark-600 p-8 mb-6 animate-slide-up">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
            <ShoppingBag className="w-6 h-6 text-primary-500 mr-3" />
            Order Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-600">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Order ID:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">#{order._id?.slice(-8) || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-600">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Customer Name:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{order.studentName}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-600">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Mobile Number:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{order.mobileNumber}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-600">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Payment Method:</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{order.paymentMethod}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-dark-600">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Status:</span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                {order.status || 'Pending'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 dark:text-gray-300 font-medium text-lg">Total Amount:</span>
              <span className="font-bold text-2xl text-primary-600 dark:text-primary-400">₹{order.amount}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Items Ordered:</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Special Instructions:</h4>
              <p className="text-gray-700 dark:text-gray-300">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <button
            onClick={handleDownloadBill}
            className="flex-1 flex items-center justify-center px-6 py-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Bill
          </button>
          
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Order More
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center px-6 py-4 bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
        </div>

        {/* Hidden BillDownload Component */}
        <div className="hidden">
          <BillDownload order={order} />
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage