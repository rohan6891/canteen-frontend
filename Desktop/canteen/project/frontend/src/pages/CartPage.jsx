import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, User, CreditCard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../services/api'
import BillDownload from '../components/BillDownload'
import { RAZORPAY_CONFIG, loadRazorpayScript } from '../config/razorpay'

const CartPage = () => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [showBillDownload, setShowBillDownload] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    studentName: '',
    mobileNumber: '',
    paymentMethod: 'UPI',
    notes: ''
  })

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId)
  }

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }

    if (!customerInfo.studentName || !customerInfo.mobileNumber) {
      alert('Please fill in your name and mobile number')
      return
    }

    try {
      setLoading(true)

      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity
        })),
        studentName: customerInfo.studentName,
        mobileNumber: customerInfo.mobileNumber,
        paymentMethod: customerInfo.paymentMethod,
        notes: customerInfo.notes,
        amount: getTotalPrice()
      }

      // For Cash payment, proceed directly
      if (customerInfo.paymentMethod === 'Cash') {
        const response = await orderAPI.create(orderData)
        
        if (response.data.success) {
          clearCart()
          navigate('/order-success', { state: { order: response.data.order } })
        }
        return
      }

      // For UPI and Card payments, use Razorpay
      if (customerInfo.paymentMethod === 'UPI' || customerInfo.paymentMethod === 'Card') {
        const scriptLoaded = await loadRazorpayScript()
        
        if (!scriptLoaded) {
          alert('Razorpay SDK failed to load. Please check your internet connection.')
          return
        }

        const options = {
          key: RAZORPAY_CONFIG.key_id,
          amount: getTotalPrice() * 100, // Amount in paise
          currency: RAZORPAY_CONFIG.currency,
          name: RAZORPAY_CONFIG.name,
          description: `Order for ${customerInfo.studentName}`,
          prefill: {
            name: customerInfo.studentName,
            contact: customerInfo.mobileNumber
          },
          theme: RAZORPAY_CONFIG.theme,
          handler: async function (response) {
            try {
              // Payment successful, create order
              const orderDataWithPayment = {
                ...orderData,
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'completed'
              }
              
              const orderResponse = await orderAPI.create(orderDataWithPayment)
              
              if (orderResponse.data.success) {
                clearCart()
                navigate('/order-success', { state: { order: orderResponse.data.order } })
              }
            } catch (error) {
              console.error('Order creation error:', error)
              alert('Payment successful but order creation failed. Please contact support.')
            }
          },
          modal: {
            ondismiss: function() {
              alert('Payment cancelled')
            }
          }
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
        return
      }

      // Fallback for other payment methods
      alert('Please select a valid payment method')
      
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseBillDownload = () => {
    setShowBillDownload(false)
    setCompletedOrder(null)
    navigate('/menu')
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-700 dark:to-dark-600 rounded-full flex items-center justify-center shadow-lg dark:shadow-dark-lg">
            <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary-500/20 dark:bg-primary-400/20 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">Add some delicious items from our menu!</p>
        <button
          onClick={() => navigate('/menu')}
          className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 dark:from-primary-400 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary-500/25 dark:hover:shadow-primary-400/25 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Browse Menu
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent mb-4">Your Cart</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Review your order and proceed to checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <span>Order Items</span>
            </h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={item._id} className="group flex items-center space-x-4 p-4 bg-gray-50/80 dark:bg-dark-700/50 rounded-xl border border-gray-200 dark:border-dark-600 hover:shadow-lg dark:hover:shadow-dark-lg transition-all duration-300 hover:scale-[1.02] animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">₹{item.price} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-dark-600 border border-gray-200 dark:border-dark-500 hover:bg-gray-50 dark:hover:bg-dark-500 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
                    >
                      <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-dark-800 px-2 py-1 rounded-lg">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-dark-600 border border-gray-200 dark:border-dark-500 hover:bg-gray-50 dark:hover:bg-dark-500 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">₹{item.price * item.quantity}</div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center space-x-1 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
              <User className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <span>Customer Information</span>
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={customerInfo.studentName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300 hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={customerInfo.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300 hover:shadow-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Instructions
                </label>
                <textarea
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleInputChange}
                  placeholder="Any special requests..."
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300 hover:shadow-md resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <span>Payment Method</span>
            </h2>
            
            <div className="space-y-3">
              {['UPI', 'Cash'].map(method => (
                <label key={method} className="group flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-all duration-300">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={customerInfo.paymentMethod === method}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-2 border-gray-300 dark:border-dark-500 bg-gray-50 dark:bg-dark-700"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-300">Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">₹{getTotalPrice()}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-dark-600 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">₹{getTotalPrice()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 dark:from-primary-400 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary-500/25 dark:hover:shadow-primary-400/25 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Place Order - ₹${getTotalPrice()}`
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bill Download Modal */}
      {showBillDownload && completedOrder && (
        <BillDownload 
          order={completedOrder} 
          onClose={handleCloseBillDownload}
        />
      )}
    </div>
  )
}

export default CartPage