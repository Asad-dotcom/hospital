import api from '../index.js';

const BillingService = {
  // Pending Appointments
  getPendingBilling: async () => {
    const response = await api.get('/admin/billing/pending');
    return response.data;
  },

  // Appointment Operations
  getAppointmentDetails: async (appointmentId) => {
    const response = await api.get(`/admin/appointments/${appointmentId}`);
    return response.data;
  },

  createBill: async (appointmentId) => {
    const response = await api.post(`/admin/billing/appointments/${appointmentId}`);
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    await api.delete(`/admin/appointments/${appointmentId}`);
  },

  // Export Operations
  exportBill: async (appointmentId) => {
    const response = await api.get(`/admin/billing/appointments/${appointmentId}/bill/export`, {
      responseType: 'blob'
    });
    return response;
  },

  exportPrescription: async (appointmentId) => {
    const response = await api.get(`/admin/billing/appointments/${appointmentId}/prescription/export`, {
      responseType: 'blob'
    });
    return response;
  },

  // Billing History
  getBillingHistory: async () => {
    const response = await api.get('/admin/billing/history');
    return response.data;
  },

  // Prescription Operations
  getPrescriptions: async () => {
    const response = await api.get('/admin/billing/prescriptions');
    return response.data;
  },

  createPrescription: async (prescriptionData) => {
    const response = await api.post('/admin/billing/prescriptions', prescriptionData);
    return response.data;
  },

  updatePrescription: async (prescriptionId, prescriptionData) => {
    const response = await api.put(`/admin/billing/prescriptions/${prescriptionId}`, prescriptionData);
    return response.data;
  },

  getPrescriptionDetails: async (prescriptionId) => {
    const response = await api.get(`/admin/billing/prescriptions/${prescriptionId}`);
    return response.data;
  }
};

export default BillingService;