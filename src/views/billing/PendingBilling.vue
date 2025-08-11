<template>
  <div class="pending-billing">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Pending Appointments</h3>
      <button @click="refreshPending" class="btn btn-sm btn-outline-secondary">
        <i class="bi bi-arrow-clockwise"></i> Refresh
      </button>
    </div>
    
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div v-else-if="pendingAppointments.length === 0" class="alert alert-info">
      No pending appointments for billing.
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-light">
          <tr>
            <th>Appointment ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in pendingAppointments" :key="appointment.id">
            <td>{{ appointment.id }}</td>
            <td>{{ appointment.patientName }}</td>
            <td>{{ formatDate(appointment.date) }}</td>
            <td>{{ appointment.doctorName }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <router-link 
                  :to="`/billing/new?appointment=${appointment.id}`"
                  class="btn btn-success"
                  title="Create Bill"
                >
                  <i class="bi bi-receipt"></i> Create Bill
                </router-link>
                <button 
                  @click="handleExportBill(appointment.id)"
                  class="btn btn-primary"
                  title="Export Bill"
                >
                  <i class="bi bi-file-earmark-excel"></i> Export Bill
                </button>
                <button 
                  @click="handleExportPrescription(appointment.id)"
                  class="btn btn-info"
                  title="Export Prescription"
                >
                  <i class="bi bi-file-medical"></i> Export Prescription
                </button>
                <button 
                  @click="handleCancelAppointment(appointment.id)"
                  class="btn btn-danger"
                  title="Cancel Appointment"
                >
                  <i class="bi bi-x-circle"></i> Cancel Appointment
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import BillingService from '@/api/services/billingService';
import { formatDate } from '@/utils/dateUtils';

export default {
  name: 'PendingBilling',
  data() {
    return {
      pendingAppointments: [],
      loading: false
    };
  },
  created() {
    this.fetchPendingAppointments();
  },
  methods: {
    formatDate,
    
    async fetchPendingAppointments() {
      this.loading = true;
      try {
        this.pendingAppointments = await BillingService.getPendingBilling();
      } catch (error) {
        console.error('Error loading pending appointments:', error);
        this.$toast.error('Failed to load pending appointments');
      } finally {
        this.loading = false;
      }
    },
    
    refreshPending() {
      this.fetchPendingAppointments();
    },
    
    async handleExportBill(appointmentId) {
      try {
        const response = await BillingService.exportBill(appointmentId);
        this.downloadFile(response, `bill-${appointmentId}.xlsx`);
        this.$toast.success('Bill exported successfully');
      } catch (error) {
        console.error('Error exporting bill:', error);
        this.$toast.error('Failed to export bill');
      }
    },
    
    async handleExportPrescription(appointmentId) {
      try {
        const response = await BillingService.exportPrescription(appointmentId);
        this.downloadFile(response, `prescription-${appointmentId}.xlsx`);
        this.$toast.success('Prescription exported successfully');
      } catch (error) {
        console.error('Error exporting prescription:', error);
        this.$toast.error('Failed to export prescription');
      }
    },
    
    async handleCancelAppointment(appointmentId) {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
          await BillingService.cancelAppointment(appointmentId);
          this.$toast.success('Appointment cancelled successfully');
          await this.fetchPendingAppointments();
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          this.$toast.error('Failed to cancel appointment');
        }
      }
    },
    
    downloadFile(response, filename) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
.table-responsive {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
</style>