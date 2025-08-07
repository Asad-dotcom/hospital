import api from '../index'

class AppointmentService {
  // Get all appointments
  async getAppointments() {
    const response = await api.get('/appointments')
    return response.data
  }

  // Get single appointment by ID
  async getAppointment(id) {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  }

  // Create new appointment
  async createAppointment(appointmentData) {
    const response = await api.post('/appointments', appointmentData)
    return response.data
  }

  // Update appointment
  async updateAppointment(id, appointmentData) {
    const response = await api.put(`/appointments/${id}`, appointmentData)
    return response.data
  }

  // Delete appointment
  async deleteAppointment(id) {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  }

  // Get appointments by patient
  async getAppointmentsByPatient(patientId) {
    const response = await api.get(`/appointments?patient_id=${patientId}`)
    return response.data
  }

  // Get appointments by doctor
  async getAppointmentsByDoctor(doctorId) {
    const response = await api.get(`/appointments?doctor_id=${doctorId}`)
    return response.data
  }

  // Get appointments by date
  async getAppointmentsByDate(date) {
    const response = await api.get(`/appointments?date=${date}`)
    return response.data
  }

  // Update appointment status
  async updateAppointmentStatus(id, status) {
    const response = await api.patch(`/appointments/${id}/status`, { status })
    return response.data
  }
}

export default new AppointmentService()
