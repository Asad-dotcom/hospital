import api from '../index'

class EnhancedPatientService {
  constructor() {
    this.baseEndpoint = '/admin/patients'
  }

  // Get all patients
  async getPatients() {
    try {
      const response = await api.get(this.baseEndpoint)
      return response.data.data || response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Create new patient
  async createPatient(patientData) {
    try {
      const response = await api.post(this.baseEndpoint, patientData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get single patient
  async getPatient(id) {
    try {
      const response = await api.get(`${this.baseEndpoint}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Update patient
  async updatePatient(id, patientData) {
    try {
      const response = await api.put(`${this.baseEndpoint}/${id}`, patientData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Delete patient
  async deletePatient(id) {
    try {
      const response = await api.delete(`${this.baseEndpoint}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Simple error handler
  handleError(error) {
    console.error('API Error:', error)
    if (error.response) {
      return new Error(error.response.data.message || 'Request failed')
    }
    return new Error('Network error. Please try again.')
  }
}

export default new EnhancedPatientService()