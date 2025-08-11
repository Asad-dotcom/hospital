<template>
  <div class="patient-dashboard container py-4">
    <!-- Header with patient greeting -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Welcome, {{ patient.name }}</h2>
      <div v-if="hasNewDocuments" class="badge bg-danger">
        New Documents
      </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="row mb-4 g-3">
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-info-light">
                <i class="bi bi-calendar-check text-info"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0">Upcoming</h6>
                <p class="mb-0 fw-bold">{{ stats.upcoming }} Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-warning-light">
                <i class="bi bi-file-medical text-warning"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0">Pending</h6>
                <p class="mb-0 fw-bold">{{ stats.pending }} Requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-success-light">
                <i class="bi bi-check-circle text-success"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0">Approved</h6>
                <p class="mb-0 fw-bold">{{ stats.approved }} Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stat-card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-primary-light">
                <i class="bi bi-chat-square-text text-primary"></i>
              </div>
              <div class="ms-3">
                <h6 class="mb-0">Messages</h6>
                <p class="mb-0 fw-bold">{{ stats.messages }} Unread</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointment Booking Section -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Book New Appointment</h5>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Select Doctor</label>
            <select v-model="newAppointment.doctorId" class="form-select" @change="fetchDoctorAvailability">
              <option value="">Choose doctor</option>
              <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                {{ doctor.name }} ({{ doctor.specialization }})
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Available Dates</label>
            <select v-model="newAppointment.date" class="form-select" :disabled="!newAppointment.doctorId" @change="fetchTimeSlots">
              <option value="">Select date first</option>
              <option v-for="date in availableDates" :key="date" :value="date">
                {{ formatDate(date) }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Available Time Slots</label>
            <select v-model="newAppointment.timeSlot" class="form-select" :disabled="!newAppointment.date">
              <option value="">Select time slot</option>
              <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
                {{ slot }}
              </option>
            </select>
          </div>
          <div class="col-12 mt-3">
            <label class="form-label">Reason for Appointment (Optional)</label>
            <textarea 
              v-model="newAppointment.reason" 
              class="form-control" 
              rows="2"
              placeholder="Briefly describe the reason for your appointment">
            </textarea>
          </div>
          <div class="col-12">
            <button class="btn btn-primary" @click="submitAppointment" :disabled="!isAppointmentFormValid">
              Request Appointment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Appointments -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Recent Appointments</h5>
        <router-link to="/appointments" class="small">View All</router-link>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <ul v-else-if="appointments.length" class="list-group list-group-flush">
          <li v-for="appt in appointments" :key="appt.id" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">Dr. {{ appt.doctor.name }}</h6>
                <small class="text-muted">{{ formatDate(appt.date) }} at {{ appt.time }}</small>
                <div class="mt-1">
                  <small>Reason: {{ appt.reason || 'Not specified' }}</small>
                </div>
              </div>
              <span :class="`badge bg-${getStatusBadgeClass(appt.status)}`">
                {{ appt.status }}
              </span>
            </div>
            <div v-if="appt.status === 'rejected'" class="mt-2 text-danger small">
              <strong>Reason:</strong> {{ appt.rejectionReason || 'No reason provided' }}
            </div>
          </li>
        </ul>
        <div v-else class="text-center py-4 text-muted">
          No appointments found
        </div>
      </div>
    </div>

    <!-- Alerts Section -->
    <div v-if="alerts.length" class="mb-4">
      <div v-for="(alert, index) in alerts" :key="index" 
           :class="`alert alert-${alert.type} alert-dismissible fade show`" role="alert">
        <strong>{{ alert.title }}</strong> {{ alert.message }}
        <button type="button" class="btn-close" @click="dismissAlert(index)"></button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import appointmentService from '@/api/services/appointmentService';

export default {
  data() {
    return {
      loading: false,
      patient: {
        id: 1, // Should come from auth
        name: 'John Doe'
      },
      stats: {
        upcoming: 0,
        pending: 0,
        approved: 0,
        messages: 0
      },
      doctors: [],
      appointments: [],
      alerts: [],
      newAppointment: {
        doctorId: '',
        date: '',
        timeSlot: '',
        reason: ''
      },
      availableDates: [],
      availableTimeSlots: [],
      hasNewDocuments: false
    };
  },
  computed: {
    isAppointmentFormValid() {
      return (
        this.newAppointment.doctorId && 
        this.newAppointment.date && 
        this.newAppointment.timeSlot
      );
    }
  },
  created() {
    this.fetchDoctors();
    this.fetchAppointments();
    this.setupWebSocket();
  },
  methods: {
    async fetchDoctors() {
      try {
        const response = await axios.get('/api/doctors');
        this.doctors = response.data;
      } catch (error) {
        this.showAlert('error', 'Failed to load doctors', error.message);
      }
    },
    async fetchDoctorAvailability() {
      if (!this.newAppointment.doctorId) return;
      
      try {
        const response = await axios.get(`/api/doctors/${this.newAppointment.doctorId}/availability`);
        this.availableDates = response.data.availableDates;
        this.newAppointment.date = '';
        this.newAppointment.timeSlot = '';
      } catch (error) {
        this.showAlert('error', 'Failed to load availability', error.message);
      }
    },
    async fetchTimeSlots() {
      if (!this.newAppointment.doctorId || !this.newAppointment.date) return;
      
      try {
        const response = await axios.get(
          `/api/doctors/${this.newAppointment.doctorId}/availability/${this.newAppointment.date}`
        );
        this.availableTimeSlots = response.data.timeSlots;
        this.newAppointment.timeSlot = '';
      } catch (error) {
        this.showAlert('error', 'Failed to load time slots', error.message);
      }
    },
    async fetchAppointments() {
      this.loading = true;
      try {
        const response = await appointmentService.getAllAppointments();
        // Filter to show only this patient's appointments
        this.appointments = response.data.filter(
          appt => appt.patient_id === this.patient.id
        );
        this.updateStats();
      } catch (error) {
        console.error('Fetch appointments error:', error);
        this.showAlert('error', 'Failed to load appointments', 
          error.response?.data?.message || 'Please try again later');
      } finally {
        this.loading = false;
      }
    },
    async submitAppointment() {
      try {
        if (!this.isAppointmentFormValid) {
          this.showAlert('warning', 'Incomplete Form', 'Please fill all required fields');
          return;
        }

        const payload = {
          doctor_id: this.newAppointment.doctorId,
          appointment_date: this.newAppointment.date,
          appointment_time: this.newAppointment.timeSlot,
          patient_id: this.patient.id,
          reason: this.newAppointment.reason || '',
          status: 'pending' // Default status
        };

        // Use the appointment service
        await appointmentService.createAppointment(payload);
        
        this.showAlert('success', 'Appointment Requested', 
          `Your appointment with Dr. ${this.getDoctorName(payload.doctor_id)} has been submitted for approval`);
        
        this.resetAppointmentForm();
        this.fetchAppointments(); // Refresh the appointments list
      } catch (error) {
        console.error('Appointment error:', error);
        this.showAlert('error', 'Request Failed', 
          error.response?.data?.message || 'Failed to book appointment');
      }
    },
    setupWebSocket() {
      // Implement real-time updates for appointment status changes
      const socket = new WebSocket('ws://your-api-endpoint/notifications');
      
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'appointment_update') {
          this.showAlert('info', 'Appointment Update', 
            `Your appointment on ${this.formatDate(data.date)} has been ${data.status}`);
          this.fetchAppointments();
        }
      };
    },
    updateStats() {
      this.stats = {
        upcoming: this.appointments.filter(a => a.status === 'approved').length,
        pending: this.appointments.filter(a => a.status === 'pending').length,
        approved: this.appointments.filter(a => a.status === 'approved').length,
        messages: 0 // You would fetch this from your messages API
      };
    },
    getDoctorName(doctorId) {
      const doctor = this.doctors.find(d => d.id === doctorId);
      return doctor ? doctor.name : '';
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'approved': return 'success';
        case 'pending': return 'warning';
        case 'rejected': return 'danger';
        default: return 'secondary';
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    showAlert(type, title, message) {
      this.alerts.push({ type, title, message });
      setTimeout(() => this.dismissAlert(this.alerts.length - 1), 5000);
    },
    dismissAlert(index) {
      this.alerts.splice(index, 1);
    },
    resetAppointmentForm() {
      this.newAppointment = {
        doctorId: '',
        date: '',
        timeSlot: '',
        reason: ''
      };
      this.availableDates = [];
      this.availableTimeSlots = [];
    }
  }
};
</script>

<style scoped>
.patient-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  border-radius: 10px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-info-light {
  background-color: rgba(13, 110, 253, 0.1);
}

.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.1);
}

.bg-success-light {
  background-color: rgba(25, 135, 84, 0.1);
}

.bg-primary-light {
  background-color: rgba(13, 110, 253, 0.1);
}

.card {
  border: none;
  border-radius: 10px;
}
</style>