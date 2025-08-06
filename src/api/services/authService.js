import api from '../index.js'

class AuthService {
  // Unified login for all roles
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Unified registration for all roles
  async register(userData) {
    try {
      const response = await api.post('/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Get current user (unified)
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No token found')
      
      const response = await api.get('/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token')
  }
}

export default new AuthService()
