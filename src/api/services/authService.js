import api from '../index.js'

class AuthService {
  // Unified login for all roles
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error.response?.data || { message: 'Login failed' }
    }
  }

  // Unified registration for all roles
  async register(userData) {
    try {
      const response = await api.post('/register', userData)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      console.error('Register error:', error)
      throw error.response?.data || { message: 'Registration failed' }
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      const response = await api.get('/me')
      return response.data
    } catch (error) {
      console.error('Get current user error:', error)
      throw error.response?.data || { message: 'Failed to get user info' }
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  // Get token
  getToken() {
    return localStorage.getItem('token')
  }

  // Get user
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}

export default new AuthService()
