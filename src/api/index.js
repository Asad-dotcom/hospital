import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://51.20.69.6:8080/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url)
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status)
    return response
  },
  (error) => {
    console.error('Response error:', error)
    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to login
      console.log('Unauthorized - redirect to login')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default api
