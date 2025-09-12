import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if admin is already authenticated on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    const adminExpiry = localStorage.getItem('adminExpiry')
    
    if (adminToken && adminExpiry) {
      const now = new Date().getTime()
      if (now < parseInt(adminExpiry)) {
        setIsAdminAuthenticated(true)
      } else {
        // Token expired, clear storage
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminExpiry')
      }
    }
    setIsLoading(false)
  }, [])

  const adminLogin = (username, password) => {
    // Simple hardcoded authentication
    if (username === 'admin' && password === 'admin123') {
      const token = 'admin_' + Date.now()
      const expiry = new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
      
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminExpiry', expiry.toString())
      setIsAdminAuthenticated(true)
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const adminLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminExpiry')
    setIsAdminAuthenticated(false)
  }

  const value = {
    isAdminAuthenticated,
    isLoading,
    adminLogin,
    adminLogout
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContext