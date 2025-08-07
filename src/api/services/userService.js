import api from '../index'

export const userService = {
  // Get all users
  async getUsers() {
    const response = await api.get('/users')
    return response.data
  },

  // Get single user by ID
  async getUser(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Create new user
  async createUser(userData) {
    const response = await api.post('/users', userData)
    return response.data
  },

  // Update user
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  // Delete user
  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  // Get user appointments
  async getUserAppointments(userId) {
    const response = await api.get(`/users/${userId}/appointments`)
    return response.data
  },

  // Get all appointments
  async getAppointments() {
    const response = await api.get('/appointments')
    return response.data
  },

  // Get all doctors
  async getDoctors() {
    const response = await api.get('/doctors')
    return response.data
  },

  // Get all patients
  async getPatients() {
    const response = await api.get('/patients')
    return response.data
  },

  // Generic method for any endpoint
  async get(endpoint) {
    const response = await api.get(endpoint)
    return response.data
  },

  async post(endpoint, data) {
    const response = await api.post(endpoint, data)
    return response.data
  },

  async put(endpoint, data) {
    const response = await api.put(endpoint, data)
    return response.data
  },

  async delete(endpoint) {
    const response = await api.delete(endpoint)
    return response.data
  }
}
