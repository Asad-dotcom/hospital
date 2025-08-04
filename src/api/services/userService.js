import api from '../index'

export const userService = {
  // Get all users
  getUsers() {
    return api.get('/users')
  },

  // Get single user by ID
  getUser(id) {
    return api.get(`/users/${id}`)
  },

  // Create new user
  createUser(userData) {
    return api.post('/users', userData)
  },

  // Update user
  updateUser(id, userData) {
    return api.put(`/users/${id}`, userData)
  },

  // Delete user
  deleteUser(id) {
    return api.delete(`/users/${id}`)
  },

  // Get user appointments (example endpoint)
  getUserAppointments(userId) {
    return api.get(`/users/${userId}/appointments`)
  },

  // Get all appointments
  getAppointments() {
    return api.get('/appointments')
  },

  // Get all doctors
  getDoctors() {
    return api.get('/doctors')
  },

  // Get all patients
  getPatients() {
    return api.get('/patients')
  },

  // Generic method for any endpoint
  get(endpoint) {
    return api.get(endpoint)
  },

  post(endpoint, data) {
    return api.post(endpoint, data)
  },

  put(endpoint, data) {
    return api.put(endpoint, data)
  },

  delete(endpoint) {
    return api.delete(endpoint)
  }
}
