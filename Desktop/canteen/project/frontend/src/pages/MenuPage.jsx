import React, { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import MenuItemCard from '../components/MenuItemCard'
import TextType from '../components/TextType'
import { menuAPI } from '../services/api'

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts']

  useEffect(() => {
    fetchMenuItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [menuItems, searchTerm, selectedCategory])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const response = await menuAPI.getAll({ available: true })
      setMenuItems(response.data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
      alert('Failed to load menu items. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = menuItems

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-800 mx-auto mb-6"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium animate-pulse">Loading delicious menu...</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12 animate-slide-down">
        <div className="relative inline-block">
          <TextType 
            text="Our Menu" 
            className="text-6xl font-bold text-purple-400" 
            typingSpeed={100} 
            showCursor={true} 
            cursorCharacter="|" 
            loop={false} 
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg blur opacity-20 dark:opacity-30 animate-pulse"></div>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Fresh, delicious meals made with love and the finest ingredients
        </p>
        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"></div>
        </div>
      </div>


      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12 animate-slide-up">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors duration-300 group-focus-within:text-primary-500" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border border-gray-200 dark:border-dark-600 rounded-xl shadow-lg dark:shadow-dark-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all duration-300 hover:shadow-xl focus:shadow-glow"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors duration-300 group-focus-within:text-primary-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-12 pr-10 py-4 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border border-gray-200 dark:border-dark-600 rounded-xl shadow-lg dark:shadow-dark-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent appearance-none transition-all duration-300 hover:shadow-xl focus:shadow-glow cursor-pointer"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-700 dark:to-dark-600 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xl font-medium mb-2">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No items match your search criteria.' 
                : 'No menu items available at the moment.'
              }
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              Try adjusting your search or browse all categories
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item, index) => (
            <div 
              key={item._id} 
              className="animate-scale-in"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-center mt-12 animate-fade-in">
        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-full shadow-lg dark:shadow-dark-lg border border-gray-200 dark:border-dark-600">
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            Showing {filteredItems.length} of {menuItems.length} items
          </span>
          {filteredItems.length > 0 && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenuPage