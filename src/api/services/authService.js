// src/api/services/authService.js
import api from '../index.js'

class AuthService {
 async login(credentials) {
  // Always hit the API
  console.log("Login payload:", credentials);
  const response = await api.post('/login', credentials)

  const token = response.data?.data?.access_token
  const user = response.data?.data?.user

  if (token && user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  return { token, user }
}

  async register(userData) {
    const response = await api.post('/register', userData)

    // Some APIs return token+user, some don't
    const token = response.data?.data?.access_token || response.data?.token
    const user = response.data?.data?.user || response.data?.user

    if (token && user) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }

    return { token, user }
  }

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export default new AuthService()
