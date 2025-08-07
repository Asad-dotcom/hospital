import api from '../index.js'

class AuthService {
  // Unified login for all roles
  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials);
      const response = await api.post('/login', credentials)
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw error.response.data
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw { message: 'Network error. Please check your connection.' }
      } else {
        throw { message: 'Login failed. Please try again.' }
      }
    }
  }

  // Unified registration for all roles
  async register(userData) {
    try {
      console.log('Attempting registration with:', userData);
      const response = await api.post('/register', userData)
      console.log('Registration response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data
    } catch (error) {
      console.error('Register error:', error)
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw error.response.data
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw { message: 'Network error. Please check your connection.' }
      } else {
        throw { message: 'Registration failed. Please try again.' }
      }
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
