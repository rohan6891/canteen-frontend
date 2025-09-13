import React, { useState } from 'react'
import { Plus, Minus, ShoppingCart, Info, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const MenuItemCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(item, quantity)
    setQuantity(1) // Reset quantity after adding
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  return (
    <div className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 dark:hover:shadow-primary-400/10 hover:-translate-y-2 hover:scale-105 animate-fade-in overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      {/* Image Container */}
      <div className="relative mb-6 overflow-hidden rounded-xl">
        <div className="aspect-w-16 aspect-h-10">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
            }}
          />
        </div>
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Floating Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg transition-all duration-300 ${
            item.isAvailable 
              ? 'bg-green-500/90 text-white border border-green-400/50' 
              : 'bg-red-500/90 text-white border border-red-400/50'
          }`}>
            {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
          </span>
        </div>
      </div>
      
      <div className="relative space-y-4">
        {/* Title and Info Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 flex-1">
            {item.name}
          </h3>
          {item.description && (
            <button
              onClick={() => setShowInfoModal(true)}
              className="ml-2 p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-800/50 text-primary-600 dark:text-primary-400 transition-all duration-300 hover:scale-110 active:scale-95"
              title="View full description"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        
        {/* Price and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
              ₹{item.price}
            </span>
          </div>
          <div className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-dark-700 rounded-full">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {item.preparationTime} min
            </span>
          </div>
        </div>
        
        {/* Action Section */}
        {item.isAvailable ? (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-600">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={decrementQuantity}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
              >
                <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <span className="text-lg font-bold w-8 text-center text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-dark-800 px-3 py-1 rounded-lg">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 dark:from-primary-400 dark:to-primary-500 dark:hover:from-primary-500 dark:hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary-500/25 dark:hover:shadow-primary-400/25 transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
            >
              <ShoppingCart className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-12" />
              <span>Add to Cart</span>
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-200 dark:border-dark-600">
            <div className="flex items-center justify-center py-3 px-4 bg-gray-100 dark:bg-dark-700 rounded-xl">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Currently Unavailable</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInfoModal(false)}>
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.name}</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              {/* Image */}
              <div className="mb-4 rounded-xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
                  }}
                />
              </div>
              
              {/* Description */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price</span>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{item.price}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Prep Time</span>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.preparationTime} min</p>
                  </div>
                </div>
                
                {/* Availability Status */}
                <div className="pt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    item.isAvailable 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {item.isAvailable ? '✓ Available' : '✗ Currently Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuItemCard