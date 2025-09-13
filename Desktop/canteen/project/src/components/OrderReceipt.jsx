import React from 'react'
import { Download, QrCode, Clock, User, CreditCard } from 'lucide-react'
import { orderAPI } from '../services/api'

const OrderReceipt = ({ order }) => {
  const handleDownloadReceipt = async () => {
    try {
      const response = await orderAPI.downloadReceipt(order.orderId)
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `order-${order.orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading receipt:', error)
      alert('Failed to download receipt. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'status-pending',
      'In Progress': 'status-in-progress',
      'Ready': 'status-ready',
      'Completed': 'status-completed',
      'Cancelled': 'status-cancelled'
    }
    return colors[status] || 'status-pending'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  return (
    <div className="card p-6 max-w-md mx-auto animate-slide-up">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Receipt</h2>
        <div className="text-3xl font-bold text-primary-600 mb-2">
          {order.orderId}
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">Order Time</div>
            <div className="font-medium">{formatDate(order.createdAt)}</div>
          </div>
        </div>

        {order.studentName !== 'Anonymous' && (
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">Student</div>
              <div className="font-medium">{order.studentName}</div>
              {order.mobileNumber && (
                <div className="text-sm text-gray-500">{order.mobileNumber}</div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">Payment Method</div>
            <div className="font-medium">{order.paymentMethod}</div>
          </div>
        </div>

        {order.estimatedTime && (
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">Estimated Ready Time</div>
              <div className="font-medium">{formatDate(order.estimatedTime)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="border-t pt-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
        <div className="space-y-2">
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">
                  {item.quantity} × ₹{item.price}
                </div>
              </div>
              <div className="font-medium">₹{item.subtotal}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total Amount</span>
          <span className="text-primary-600">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* QR Code */}
      {order.qrCode && (
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img
              src={order.qrCode}
              alt="Order QR Code"
              className="w-32 h-32 border rounded-lg"
            />
          </div>
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <QrCode className="w-4 h-4" />
            <span>Show this QR code when collecting your order</span>
          </div>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={handleDownloadReceipt}
        className="w-full btn-primary flex items-center justify-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>Download PDF Receipt</span>
      </button>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          Please keep this receipt until you collect your order. 
          Show the QR code or order ID to the canteen staff.
        </p>
      </div>
    </div>
  )
}

export default OrderReceipt