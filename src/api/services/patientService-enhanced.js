import api from '../index'
import { checkAuthStatus, handleAuthError } from '@/utils/authCheck'

class EnhancedPatientService {
  constructor() {
    this.baseEndpoint = '/patients'
    this.adminEndpoint = '/admin/patients'
  }

  // Get appropriate endpoint based on user role
  getEndpoint() {
   
    return  this.adminEndpoint
  }

  // Get all patients with proper authentication
  async getPatients() {
    try {
      const endpoint = this.getEndpoint()
      console.log('Fetching patients from:', endpoint)
      
      const response = await api.get(endpoint)
      console.log(response.data.data)
      
      return response.data.data
    } catch (error) {
      console.error('Error fetching patients:', error)
      
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.')
      }
      
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view patients.')
      }
      
      throw new Error(handleAuthError(error))
    }
  }

  // Get single patient by ID
  async getPatient(id) {
    try {
      const endpoint = this.getEndpoint()
      const response = await api.get(`${endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching patient:', error)
      throw new Error(handleAuthError(error))
    }
  }

  // Create new patient
  async createPatient(patientData) {
    try {
      const endpoint = this.getEndpoint()
      const response = await api.post(endpoint, patientData)
      return response.data
    } catch (error) {
      console.error('Error creating patient:', error)
      throw new Error(handleAuthError(error))
    }
  }

  // Update patient
  async updatePatient(id, patientData) {
    try {
      const endpoint = this.getEndpoint()
      const response = await api.put(`${endpoint}/${id}`, patientData)
      return response.data
    } catch (error) {
      console.error('Error updating patient:', error)
      throw new Error(handleAuthError(error))
    }
  }

  // Delete patient
  async deletePatient(id) {
    try {
      const endpoint = this.getEndpoint()
      const response = await api.delete(`${endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting patient:', error)
      throw new Error(handleAuthError(error))
    }
  }

  // Get patient appointments
  async getPatientAppointments(patientId) {
    try {
      const endpoint = this.getEndpoint()
      const response = await api.get(`${endpoint}/${patientId}/appointments`)
      return response.data
    } catch (error) {
      console.error('Error fetching patient appointments:', error)
      throw new Error(handleAuthError(error))
    }
  }

  // Get patient medical history
  async getPatientMedicalHistory(patientId) {
    try {
      const endpoint = this.getEndpoint()
      const response = await api.get(`${endpoint}/${patientId}/medical-history`)
      return response.data
    } catch (error) {
      console.error('Error fetching patient medical history:', error)
      throw new Error(handleAuthError(error))
    }
  }

  // Upload patient documents
  async uploadPatientDocuments(patientId, formData) {
    try {
      const endpoint = this.getEndpoint()
      const response = await api.post(`${endpoint}/${patientId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading patient documents:', error)
      throw new Error(handleAuthError(error))
    }
  }

  // Check if user can perform admin actions
  canPerformAdminActions() {
    const auth = checkAuthStatus()
    return auth.hasAdminAccess
  }

  // Get user permissions
  getUserPermissions() {
    const auth = checkAuthStatus()
    return {
      canView: true,
      canCreate: auth.hasAdminAccess,
      canEdit: auth.hasAdminAccess,
      canDelete: auth.hasAdminAccess
    }
  }
}

export default new EnhancedPatientService()
