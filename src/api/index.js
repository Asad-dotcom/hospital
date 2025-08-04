import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://4f08886488fa.ngrok-free.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url)
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
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
      // Handle unauthorized access
      console.log('Unauthorized - redirect to login')
    }
    return Promise.reject(error)
  }
)

export default api
