import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ArrowRight, ArrowLeft } from 'lucide-react'

const TrackOrderPage = () => {
  const [trackingOrderId, setTrackingOrderId] = useState('')
  const navigate = useNavigate()

  const handleTrackOrder = () => {
    if (trackingOrderId.trim()) {
      // Update the stored order ID with the new one being tracked
      localStorage.setItem('currentOrderId', trackingOrderId.trim())
      navigate(`/order/${trackingOrderId.trim()}`)
    }
  }

  const handleTrackingKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrackOrder()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-6 shadow-xl">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Enter your order ID to check the real-time status and estimated delivery time
          </p>
        </div>

        {/* Tracking Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm rounded-3xl shadow-2xl dark:shadow-dark-2xl border border-gray-200 dark:border-dark-600 p-10 hover:shadow-3xl transition-all duration-500">
            <div className="space-y-8">
              {/* Order ID Input */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                  Order ID
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Enter your Order ID (e.g., CN001234)"
                    value={trackingOrderId}
                    onChange={(e) => setTrackingOrderId(e.target.value.toUpperCase())}
                    onKeyPress={handleTrackingKeyPress}
                    className="w-full px-8 py-6 bg-gray-50 dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-300 hover:shadow-lg focus:shadow-xl text-center font-mono text-xl tracking-wider font-bold"
                    maxLength="8"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  💡 Your order ID is now shorter and easier to remember!
                </p>
              </div>

              {/* Track Button */}
              <button
                onClick={handleTrackOrder}
                disabled={!trackingOrderId.trim()}
                className="w-full px-8 py-6 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl disabled:shadow-none transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                <span>Track My Order</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Updates</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Get live updates on your order status</p>
          </div>
          
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Estimated Time</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Know exactly when your order will be ready</p>
          </div>
          
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Receive alerts when your order is ready</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrderPage