import React, { useState } from 'react'
import { CheckCircle, Download, X, AlertTriangle, Receipt, User, Clock, CreditCard } from 'lucide-react'
import { orderAPI } from '../services/api';
import jsPDF from 'jspdf'

const PaymentSuccessPopup = ({ isOpen, onClose, paymentData }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  if (!isOpen || !paymentData) return null

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloading(true)
      setDownloadError('')

      // Create a temporary order object for receipt generation
      const receiptData = {
        orderId: `TEMP-${paymentData.paymentId}`,
        studentName: paymentData.orderData.studentName,
        mobileNumber: paymentData.orderData.mobileNumber,
        paymentMethod: paymentData.orderData.paymentMethod,
        paymentId: paymentData.paymentId,
        totalAmount: paymentData.orderData.amount,
        items: paymentData.orderData.items,
        createdAt: new Date().toISOString(),
        status: 'Payment Completed',
        paymentStatus: 'Completed'
      }

      // Generate receipt blob
      const receiptBlob = await generateReceiptBlob(receiptData)
      
      // Download the receipt
      const url = window.URL.createObjectURL(receiptBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `payment-receipt-${paymentData.paymentId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Receipt download error:', error)
      setDownloadError('Failed to download receipt. Please contact support.')
    } finally {
      setIsDownloading(false)
    }
  }

  const generateReceiptBlob = async (receiptData) => {
    // Calculate totals
    const itemsSubtotal = receiptData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
    const taxAmount = Math.round(itemsSubtotal * 0.05) // 5% tax
    
    // Create PDF
    const pdf = new jsPDF()
    
    // Set font
    pdf.setFont('helvetica')
    
    // Header
    pdf.setFontSize(20)
    pdf.setTextColor(0, 0, 0)
    pdf.text('PAYMENT RECEIPT', 105, 20, { align: 'center' })
    
    // Receipt details
    pdf.setFontSize(12)
    let yPos = 40
    
    pdf.setFont('helvetica', 'bold')
    pdf.text('RECEIPT DETAILS:', 20, yPos)
    pdf.setFont('helvetica', 'normal')
    yPos += 10
    pdf.text(`Receipt ID: ${receiptData.orderId}`, 20, yPos)
    yPos += 7
    pdf.text(`Payment ID: ${receiptData.paymentId}`, 20, yPos)
    yPos += 7
    pdf.text(`Date: ${new Date(receiptData.createdAt).toLocaleString('en-IN')}`, 20, yPos)
    yPos += 7
    pdf.text(`Status: ${receiptData.paymentStatus}`, 20, yPos)
    
    // Customer information
    yPos += 15
    pdf.setFont('helvetica', 'bold')
    pdf.text('CUSTOMER INFORMATION:', 20, yPos)
    pdf.setFont('helvetica', 'normal')
    yPos += 10
    pdf.text(`Name: ${receiptData.studentName}`, 20, yPos)
    yPos += 7
    pdf.text(`Mobile: ${receiptData.mobileNumber}`, 20, yPos)
    yPos += 7
    pdf.text(`Payment Method: ${receiptData.paymentMethod}`, 20, yPos)
    
    // Order details
    yPos += 15
    pdf.setFont('helvetica', 'bold')
    pdf.text('ORDER DETAILS:', 20, yPos)
    pdf.setFont('helvetica', 'normal')
    yPos += 10
    
    receiptData.items?.forEach((item, index) => {
      const itemTotal = item.price * item.quantity
      pdf.text(`${index + 1}. ${item.name || 'Item'}`, 20, yPos)
      yPos += 7
      pdf.text(`   Qty: ${item.quantity} x ₹${item.price} = ₹${itemTotal}`, 25, yPos)
      yPos += 10
    })
    
    // Billing summary
    yPos += 10
    pdf.setFont('helvetica', 'bold')
    pdf.text('BILLING SUMMARY:', 20, yPos)
    pdf.setFont('helvetica', 'normal')
    yPos += 10
    pdf.text(`Subtotal: ₹${itemsSubtotal}`, 20, yPos)
    yPos += 7
    pdf.text(`Tax (5%): ₹${taxAmount}`, 20, yPos)
    yPos += 7
    pdf.setFont('helvetica', 'bold')
    pdf.text(`TOTAL PAID: ₹${receiptData.totalAmount}`, 20, yPos)
    
    // Footer
    yPos += 20
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text('Thank you for your payment!', 105, yPos, { align: 'center' })
    yPos += 7
    pdf.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, yPos, { align: 'center' })
    
    return pdf.output('blob')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Successful</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order processing issue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Payment Processed Successfully
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Your payment was successful, but there was an issue creating your order in our system. 
                  Please download your payment receipt and contact our support team.
                </p>
                {paymentData.error && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    Error: {paymentData.error}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Details</h3>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment ID</span>
              </div>
              <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                {paymentData.paymentId}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {paymentData.orderData.studentName}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Method</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {paymentData.orderData.paymentMethod}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Payment Time</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(new Date())}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-dark-600 pt-2">
              <span className="font-semibold text-gray-900 dark:text-white">Total Amount</span>
              <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
                ₹{paymentData.orderData.amount}
              </span>
            </div>
          </div>

          {/* Order Items */}
          {paymentData.orderData.items && paymentData.orderData.items.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <div className="space-y-3">
                  {paymentData.orderData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-dark-600 last:border-b-0">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.name || `Item ${index + 1}`}
                        </div>
                        {item.category && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.category}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{item.price} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-300 dark:border-dark-500">
                    <span className="font-semibold text-gray-900 dark:text-white">Subtotal</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      ₹{paymentData.orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {downloadError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600 dark:text-red-400">{downloadError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDownloadReceipt}
              disabled={isDownloading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Receipt...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Payment Receipt</span>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Need Help?</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Please contact our support team with your payment ID: <br />
              <span className="font-mono font-bold">{paymentData.paymentId}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPopup