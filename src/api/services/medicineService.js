import api from '../index'

export default {
async getAllMedicines() {
  try {
    const response = await api.get('/admin/medicines');
    return response;
  } catch (error) {
    console.error('Error in medicineService.getAllMedicines:', error);
    throw error;
  }
},
  // Create new medicine
  createMedicine(data) {
    return api.post('/admin/medicines', data)
  },

  // Update medicine
  updateMedicine(id, data) {
    return api.put(`/admin/medicines/${id}`, data)
  },

  // Delete medicine
  deleteMedicine(id) {
    return api.delete(`/admin/medicines/${id}`)
  }
}