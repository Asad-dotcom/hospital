// doctorService-enhanced.js
import api from '../index'

class EnhancedDoctorService {
  constructor() {
    this.baseEndpoint = '/admin/doctors'
  }

  async getDoctors() {
    try {
      const response = await api.get(this.baseEndpoint)
      return response.data.data || response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createDoctor(doctorData) {
    try {
      const response = await api.post(this.baseEndpoint, doctorData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateDoctor(id, doctorData) {
    try {
      const response = await api.put(`${this.baseEndpoint}/${id}`, doctorData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteDoctor(id) {
    try {
      const response = await api.delete(`${this.baseEndpoint}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  handleError(error) {
    console.error('API Error:', error)
    if (error.response) {
      if (error.response.status === 401) {
        return new Error('Session expired. Please login again.')
      }
      return new Error(error.response.data.message || 'Request failed')
    }
    return new Error('Network error. Please try again.')
  }
}

export default new EnhancedDoctorService()