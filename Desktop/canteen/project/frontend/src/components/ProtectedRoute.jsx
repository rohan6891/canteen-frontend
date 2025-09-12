import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { Shield, Lock } from 'lucide-react'

const ProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, isLoading } = useAdmin()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mb-4 shadow-lg animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Redirect to admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Render protected content if authenticated
  return children
}

export default ProtectedRoute