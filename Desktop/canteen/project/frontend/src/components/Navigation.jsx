import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Users, Menu } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ThemeToggle from './ThemeToggle'

const Navigation = () => {
  const location = useLocation()
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const navItems = [
    { path: '/menu', name: 'Menu', icon: Menu },
    { path: '/cart', name: 'Cart', icon: ShoppingCart, badge: totalItems > 0 ? totalItems : null }
    // Dashboard removed - admin access only
  ]

  return (
    <nav className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-dark-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
              <Menu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300">
              Canteen
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {navItems.map(({ path, name, icon: Icon, badge }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group hover:scale-105 ${
                    location.pathname === path
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 dark:shadow-primary-400/25'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{name}</span>
                  {badge && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                      {badge}
                    </span>
                  )}
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              ))}
            </div>
            
            {/* Theme Toggle */}
            <div className="ml-4 pl-4 border-l border-gray-200 dark:border-dark-700">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation