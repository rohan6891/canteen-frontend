import React, { useState, useEffect } from 'react'
import { BarChart3, Clock, TrendingUp, Users, LogOut, Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react'
import DashboardTable from '../components/DashboardTable'
import { orderAPI, menuAPI } from '../services/api'
import socketService from '../services/socket'
import { useAdmin } from '../context/AdminContext'

const DashboardPage = () => {
  const { logout } = useAdmin()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuLoading, setMenuLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [showAddDish, setShowAddDish] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    image: ''
  })
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    ready: 0,
    completed: 0,
    todayRevenue: 0
  })

  useEffect(() => {
    fetchOrders()
    fetchMenuItems()
    
    // Connect to socket for real-time updates
    const socket = socketService.connect()
    
    // Listen for new orders
    socket.on('newOrder', handleNewOrder)
    socket.on('orderStatusUpdate', handleOrderUpdate)
    
    return () => {
      socket.off('newOrder', handleNewOrder)
      socket.off('orderStatusUpdate', handleOrderUpdate)
    }
  }, [])

  useEffect(() => {
    calculateStats()
  }, [orders])

  const handleNewOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev])
    
    // Show notification for new order
    showNotification(`New order received: ${newOrder.orderId}`)
  }

  const handleOrderUpdate = (data) => {
    setOrders(prev => 
      prev.map(order => 
        order.orderId === data.orderId 
          ? { ...order, ...data.order }
          : order
      )
    )
  }

  const showNotification = (message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Canteen Dashboard', {
        body: message,
        icon: '/favicon.ico'
      })
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderAPI.getAll({ 
        status: filter === 'all' ? undefined : filter,
        limit: 100 
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Failed to load orders. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true)
      const response = await menuAPI.getAll()
      setMenuItems(response.data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
      alert('Failed to load menu items. Please refresh the page.')
    } finally {
      setMenuLoading(false)
    }
  }

  const handleDishFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setDishForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImageFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setDishForm(prev => ({
          ...prev,
          image: e.target.result // Store base64 string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddDish = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', dishForm.name)
      formData.append('description', dishForm.description)
      formData.append('price', parseFloat(dishForm.price))
      formData.append('category', dishForm.category)
      formData.append('preparationTime', 10)
      
      if (selectedImageFile) {
        formData.append('image', selectedImageFile)
      }
      
      await menuAPI.add(formData)
      await fetchMenuItems()
      setShowAddDish(false)
      setDishForm({ name: '', description: '', price: '', category: '', available: true, image: '' })
      setSelectedImageFile(null)
      setImagePreview('')
      alert('Dish added successfully!')
    } catch (error) {
      console.error('Error adding dish:', error)
      alert('Failed to add dish. Please try again.')
    }
  }

  const handleEditDish = (dish) => {
    setEditingDish(dish)
    setDishForm({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      category: dish.category,
      available: dish.available,
      image: dish.image || ''
    })
    setImagePreview(dish.image || '')
    setSelectedImageFile(null)
    setShowAddDish(true)
  }

  const handleUpdateDish = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('name', dishForm.name)
      formData.append('description', dishForm.description)
      formData.append('price', parseFloat(dishForm.price))
      formData.append('category', dishForm.category)
      formData.append('preparationTime', 10)
      
      if (selectedImageFile) {
        formData.append('image', selectedImageFile)
      }
      
      await menuAPI.update(editingDish._id, formData)
      await fetchMenuItems()
      setShowAddDish(false)
      setEditingDish(null)
      setDishForm({ name: '', description: '', price: '', category: '', available: true, image: '' })
      setSelectedImageFile(null)
      setImagePreview('')
      alert('Dish updated successfully!')
    } catch (error) {
      console.error('Error updating dish:', error)
      alert('Failed to update dish. Please try again.')
    }
  }

  const handleDeleteDish = async (dishId) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      try {
        await menuAPI.delete(dishId)
        await fetchMenuItems()
        alert('Dish deleted successfully!')
      } catch (error) {
        console.error('Error deleting dish:', error)
        alert('Failed to delete dish. Please try again.')
      }
    }
  }

  const handleToggleAvailability = async (dishId, currentAvailability) => {
    try {
      const formData = new FormData()
      const dish = menuItems.find(item => item._id === dishId)
      
      formData.append('name', dish.name)
      formData.append('description', dish.description)
      formData.append('price', dish.price)
      formData.append('category', dish.category)
      formData.append('preparationTime', dish.preparationTime || 10)
      formData.append('available', !currentAvailability)
      
      await menuAPI.update(dishId, formData)
      await fetchMenuItems()
      alert(`Dish ${!currentAvailability ? 'marked as available' : 'marked as unavailable'}!`)
    } catch (error) {
      console.error('Error updating dish availability:', error)
      alert('Failed to update dish availability. Please try again.')
    }
  }

  const cancelDishForm = () => {
    setShowAddDish(false)
    setEditingDish(null)
    setDishForm({ name: '', description: '', price: '', category: '', available: true, image: '' })
    setSelectedImageFile(null)
    setImagePreview('')
  }

  const calculateStats = () => {
    const today = new Date().toDateString()
    
    const newStats = orders.reduce((acc, order) => {
      acc.total += 1
      acc[order.status.toLowerCase().replace(' ', '')] = (acc[order.status.toLowerCase().replace(' ', '')] || 0) + 1
      
      // Calculate today's revenue
      if (new Date(order.createdAt).toDateString() === today && order.status !== 'Cancelled') {
        acc.todayRevenue += order.totalAmount
      }
      
      return acc
    }, {
      total: 0,
      pending: 0,
      inprogress: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
      todayRevenue: 0
    })

    setStats({
      total: newStats.total,
      pending: newStats.pending || 0,
      inProgress: newStats.inprogress || 0,
      ready: newStats.ready || 0,
      completed: newStats.completed || 0,
      todayRevenue: newStats.todayRevenue
    })
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus)
      
      // Update local state
      setOrders(prev =>
        prev.map(order =>
          order.orderId === orderId
            ? { ...order, status: newStatus }
            : order
        )
      )
      
      // Show success message
      alert(`Order ${orderId} status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status. Please try again.')
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    fetchOrders()
  }

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total,
      icon: BarChart3,
      cardClass: 'stat-card stat-card-total'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      cardClass: 'stat-card stat-card-pending'
    },
    {
      title: 'Ready',
      value: stats.ready,
      icon: TrendingUp,
      cardClass: 'stat-card stat-card-ready'
    },
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue}`,
      icon: Users,
      cardClass: 'stat-card stat-card-revenue'
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Completed', label: 'Completed' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage orders and monitor your canteen operations
          </p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ title, value, icon: Icon, cardClass }) => (
          <div key={title} className={`${cardClass} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'menu'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Menu Management
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <>
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    filter === value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Orders {filter !== 'all' && `(${filter})`}
              </h2>
              <button
                onClick={fetchOrders}
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>
              </div>
            ) : (
              <DashboardTable 
                orders={orders} 
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </>
      )}

      {/* Menu Management Tab */}
      {activeTab === 'menu' && (
        <>
          {/* Add Dish Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddDish(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add New Dish
            </button>
          </div>

          {/* Menu Items Grid */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Menu Items ({menuItems.length})
              </h2>
              <button
                onClick={fetchMenuItems}
                className="btn-secondary"
                disabled={menuLoading}
              >
                {menuLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {menuLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading menu items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <div key={item._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">₹{item.price}</span>
                          <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            {item.category}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.available || item.isAvailable
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {item.available || item.isAvailable ? '✓ Available' : '✗ Unavailable'}
                          </span>
                        </div>

                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleAvailability(item._id, item.available || item.isAvailable)}
                        className={`flex items-center gap-1 px-3 py-1 text-white text-sm rounded transition-colors duration-200 ${
                          item.available || item.isAvailable
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {item.available || item.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                      <button
                        onClick={() => handleEditDish(item)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDish(item._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add/Edit Dish Modal */}
      {showAddDish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingDish ? 'Edit Dish' : 'Add New Dish'}
            </h3>
            <form onSubmit={editingDish ? handleUpdateDish : handleAddDish}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={dishForm.name}
                    onChange={handleDishFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={dishForm.description}
                    onChange={handleDishFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={dishForm.price}
                    onChange={handleDishFormChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={dishForm.category}
                    onChange={handleDishFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image Upload
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={dishForm.available}
                    onChange={handleDishFormChange}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Available
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  {editingDish ? 'Update Dish' : 'Add Dish'}
                </button>
                <button
                  type="button"
                  onClick={cancelDishForm}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default DashboardPage