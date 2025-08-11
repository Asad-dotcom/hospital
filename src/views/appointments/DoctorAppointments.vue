<template>
  <div class="container py-4">
    <h3 class="mb-3">Appointments</h3>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <!-- No Data -->
    <div v-else-if="appointments.length === 0" class="alert alert-info">
      No appointments found.
    </div>

    <!-- Appointments Table -->
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appt in appointments" :key="appt.id">
            <td>{{ appt.patient_name }}</td>
            <td>{{ appt.doctor_name }}</td>
            <td>{{ formatDate(appt.date) }}</td>
            <td>{{ appt.time }}</td>
            <td>
              <span class="badge" :class="statusClass(appt.status)">
                {{ appt.status }}
              </span>
            </td>
            <td>
  <button
    v-if="appt.status === 'pending'"
    class="btn btn-sm btn-success me-2"
    @click="updateStatus(appt.id, 'approved')"
  >
    Approve
  </button>
  <button
    v-if="appt.status === 'pending'"
    class="btn btn-sm btn-danger me-2"
    @click="updateStatus(appt.id, 'rejected')"
  >
    Reject
  </button>
  <button
    class="btn btn-sm btn-info me-2"
    @click="viewAppointment(appt.id)"
  >
    View
  </button>
  <button
    class="btn btn-sm btn-outline-danger"
    @click="deleteAppointment(appt.id)"
  >
    Delete
  </button>
</td>

          </tr>
        </tbody>
      </table>
      <!-- Appointment Details Modal -->
<div
  class="modal fade"
  id="appointmentModal"
  tabindex="-1"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Appointment Details</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body" v-if="selectedAppointment">
        <p><strong>Patient:</strong> {{ selectedAppointment.patient?.name }}</p>
        <p><strong>Doctor:</strong> {{ selectedAppointment.doctor?.name }}</p>
        <p><strong>Date & Time:</strong> {{ selectedAppointment.appointment_time }}</p>
        <p><strong>Status:</strong> {{ selectedAppointment.status }}</p>
        <p><strong>Notes:</strong> {{ selectedAppointment.notes || 'No notes' }}</p>
      </div>
    </div>
  </div>
</div>

    </div>
  </div>
</template>

<script>
import appointmentService from '@/api/services/appointmentService';
import { Modal } from 'bootstrap';

export default {
data() {
    return {
      appointments: [],
      loading: false,
      error: null,
      selectedAppointment: null
    };
  },
  async created() {
    await this.fetchAppointments();
  },
  methods: {
    async viewAppointment(id) {
      try {
        const res = await appointmentService.getAppointment(id);
        this.selectedAppointment = res.data?.data;

        // Show Bootstrap modal
        const modalEl = document.getElementById('appointmentModal');
        const modal = new Modal(modalEl);
        modal.show();
      } catch (error) {
        console.error('Error fetching appointment:', error);
        this.$toast.error(error.response?.data?.message || 'Failed to load details');
      }
    },
   async fetchAppointments() {
  this.loading = true;
  this.error = null;
  try {
    const response = await appointmentService.getAllAppointments();

    // The array is inside response.data.data
    const appointmentsArray = response.data?.data || [];

    this.appointments = appointmentsArray.map(appt => {
      const dt = new Date(
        appt.appointment_time.replace(/(\d{1,2} [A-Za-z]{3} \d{4}),/, '$1')
      );
      return {
        id: appt.id,
        date: dt.toISOString().split('T')[0],
        time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: appt.status,
        notes: appt.notes,
        doctor_name: appt.doctor?.name || 'Unknown Doctor',
        patient_name: appt.patient?.name || 'Unknown Patient'
      };
    });

    console.log("Normalized Appointments:", this.appointments);

  } catch (error) {
    console.error("Error fetching appointments:", error);
    this.error =
      error.response?.data?.message || "Failed to load appointments";
    this.$toast.error(this.error);
  } finally {
    this.loading = false;
  }
}
,
    async updateStatus(id, status) {
      try {
        await this.$appointmentService.updateAppointmentStatus(id, status);
        this.$toast.success(`Appointment ${status}`);
        await this.fetchAppointments();
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || 'Update failed'
        );
      }
    },
    async deleteAppointment(id) {
      try {
        await this.$appointmentService.deleteAppointment(id);
        this.$toast.success('Appointment deleted');
        await this.fetchAppointments();
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || 'Delete failed'
        );
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    statusClass(status) {
      return {
        'bg-primary': status === 'approved',
        'bg-warning': status === 'pending',
        'bg-danger': status === 'rejected'
      };
    }
  }
};
</script>
