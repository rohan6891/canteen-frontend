import React, { useState } from 'react'
import { Download, Receipt, CheckCircle, Clock, User, Hash } from 'lucide-react'
import { orderAPI } from '../services/api'

const BillDownload = ({ order, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadBill = async () => {
    setIsDownloading(true)
    try {
      const response = await orderAPI.downloadReceipt(order.orderId || order._id)
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Bill_${order.orderId || order._id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download bill. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Payment Successful!</h2>
          <p className="text-green-100 text-center">Your order has been confirmed</p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          {/* Order Number */}
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Hash className="w-5 h-5 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Order Number</span>
            </div>
            <div className="text-2xl font-bold text-center text-gray-900 dark:text-white font-mono">
              {order.orderId}
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {order.studentName || 'Anonymous'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Receipt className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
              </div>
              <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                ₹{order.totalAmount}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Order Time</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📋 Next Steps:
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Download your bill as proof of payment</li>
              <li>• Show the bill to the waiter when collecting your order</li>
              <li>• Your order number is: <span className="font-mono font-bold">{order.orderId}</span></li>
              <li>• Estimated preparation time: {Math.ceil((new Date(order.estimatedTime) - new Date()) / 60000)} minutes</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleDownloadBill}
              disabled={isDownloading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Bill...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Bill (PDF)
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-dark-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillDownload