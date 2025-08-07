import api from '../index'

class PatientService {
  // Get all patients - Admin endpoint
  async getPatients() {
    const response = await api.get('/admin/patients')
    return response.data
  }

  // Get single patient by ID - Admin endpoint
  async getPatient(id) {
    const response = await api.get(`/admin/patients/${id}`)
    return response.data
  }

  // Create new patient - Admin endpoint
  async createPatient(patientData) {
    const response = await api.post('/admin/patients', patientData)
    return response.data
  }

  // Update patient - Admin endpoint
  async updatePatient(id, patientData) {
    const response = await api.put(`/admin/patients/${id}`, patientData)
    return response.data
  }

  // Delete patient - Admin endpoint
  async deletePatient(id) {
    const response = await api.delete(`/admin/patients/${id}`)
    return response.data
  }

  // Get patient appointments
  async getPatientAppointments(patientId) {
    const response = await api.get(`/admin/patients/${patientId}/appointments`)
    return response.data
  }

  // Get patient medical history
  async getPatientMedicalHistory(patientId) {
    const response = await api.get(`/admin/patients/${patientId}/medical-history`)
    return response.data
  }

  // Upload patient documents
  async uploadPatientDocuments(patientId, formData) {
    const response = await api.post(`/admin/patients/${patientId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default new PatientService()
