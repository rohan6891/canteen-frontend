import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Menu API
export const menuAPI = {
  getAll: (params = {}) => api.get('/menu', { params }),
  add: (data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    return api.post('/menu', data, config)
  },
  update: (id, data) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {}
    return api.put(`/menu/${id}`, data, config)
  },
  delete: (id) => api.delete(`/menu/${id}`)
}

// Orders API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  downloadReceipt: (orderId) => {
    return api.get(`/orders/${orderId}/receipt`, {
      responseType: 'blob'
    })
  }
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message)
    return Promise.reject(error)
  }
)

export default api