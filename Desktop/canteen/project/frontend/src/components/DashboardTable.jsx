import React from 'react'
import { Clock, User, CreditCard, Package } from 'lucide-react'

const DashboardTable = ({ orders, onStatusChange }) => {
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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'Pending': 'In Progress',
      'In Progress': 'Ready',
      'Ready': 'Completed'
    }
    return statusFlow[currentStatus]
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      timeStyle: 'short',
      dateStyle: 'short'
    })
  }

  const calculateTotalItems = (items) => {
    return items?.reduce((total, item) => total + item.quantity, 0) || 0
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No orders found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Specifications
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4">
                <div>
                  <div className="text-lg font-bold text-primary-600">
                    {order.orderId}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(order.createdAt)}</span>
                  </div>
                  {order.estimatedTime && (
                    <div className="text-xs text-gray-400">
                      ETA: {formatTime(order.estimatedTime)}
                    </div>
                  )}
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.studentName || 'Anonymous'}
                    </div>
                    {order.mobileNumber && (
                      <div className="text-sm text-gray-500">
                        {order.mobileNumber}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {calculateTotalItems(order.items)} items
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                    {order.items?.length > 2 && '...'}
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">
                  {order.specifications ? (
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      {order.specifications}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No specifications</span>
                  )}
                </div>
              </td>
              
              <td className="px-6 py-4">
                <div className="flex items-center space-x-1">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      ₹{order.totalAmount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.paymentMethod}
                    </div>
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              
              <td className="px-6 py-4">
                {getNextStatus(order.status) && (
                  <button
                    onClick={() => onStatusChange(order.orderId, getNextStatus(order.status))}
                    className="btn-primary text-sm"
                  >
                    Mark as {getNextStatus(order.status)}
                  </button>
                )}
                {order.status === 'Ready' && (
                  <button
                    onClick={() => onStatusChange(order.orderId, 'Completed')}
                    className="btn-secondary text-sm ml-2"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DashboardTable