import api from '../index'

class DoctorService {
  // Get all doctors
  async getDoctors() {
    const response = await api.get('/doctors')
    return response.data
  }

  // Get single doctor by ID
  async getDoctor(id) {
    const response = await api.get(`/doctors/${id}`)
    return response.data
  }

  // Create new doctor
  async createDoctor(doctorData) {
    const response = await api.post('/doctors', doctorData)
    return response.data
  }

  // Update doctor
  async updateDoctor(id, doctorData) {
    const response = await api.put(`/doctors/${id}`, doctorData)
    return response.data
  }

  // Delete doctor
  async deleteDoctor(id) {
    const response = await api.delete(`/doctors/${id}`)
    return response.data
  }

  // Get doctor appointments
  async getDoctorAppointments(doctorId) {
    const response = await api.get(`/doctors/${doctorId}/appointments`)
    return response.data
  }

  // Get doctor patients
  async getDoctorPatients(doctorId) {
    const response = await api.get(`/doctors/${doctorId}/patients`)
    return response.data
  }

  // Get doctor schedule
  async getDoctorSchedule(doctorId) {
    const response = await api.get(`/doctors/${doctorId}/schedule`)
    return response.data
  }

  // Update doctor availability
  async updateDoctorAvailability(doctorId, availabilityData) {
    const response = await api.patch(`/doctors/${doctorId}/availability`, availabilityData)
    return response.data
  }
}

export default new DoctorService()
