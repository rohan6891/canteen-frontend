import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('canteenCart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
        localStorage.removeItem('canteenCart')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('canteenCart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (menuItem, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item._id === menuItem._id)
      
      if (existingItem) {
        return prev.map(item =>
          item._id === menuItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prev, { ...menuItem, quantity }]
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('canteenCart')
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}