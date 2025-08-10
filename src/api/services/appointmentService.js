import api from '../index'

export default {
  // Admin: Get all appointments
  getAllAppointments() {
    return api.get('/appointments')
  },

  // Get details of a single appointment
  getAppointment(id) {
    return api.get(`appointments/${id}`)
  },

  // Patient: Create new appointment
  createAppointment(data) {
    return api.post('patient/appointments', data)
  },

  // Doctor/Admin: Update appointment status
  updateAppointmentStatus(id, status) {
    return api.patch(`appointments/${id}/status`, { status })
  },

  // Admin: Delete an appointment
  deleteAppointment(id) {
    return api.delete(`admin/appointments/${id}`)
  }
}
