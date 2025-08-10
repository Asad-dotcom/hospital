<template>
  <div class="container py-4">
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'request' }"
          @click="activeTab = 'request'"
        >
          New Appointment
        </button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'status' }"
          @click="activeTab = 'status'"
        >
          My Appointments
        </button>
      </li>
    </ul>

    <!-- Request Form -->
    <div v-if="activeTab === 'request'">
      <h3>Request Appointment</h3>
      <form @submit.prevent="submitRequest">
        <div class="mb-3">
          <label class="form-label">Doctor</label>
          <select v-model="form.doctor_id" class="form-select" required>
            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.name }} ({{ doctor.specialization }})
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Date</label>
          <input 
            type="date" 
            v-model="form.date" 
            class="form-control" 
            :min="new Date().toISOString().split('T')[0]"
            required
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Time</label>
          <select v-model="form.time" class="form-select" required>
            <option v-for="time in timeSlots" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Submitting...' : 'Submit Request' }}
        </button>
      </form>
    </div>

    <!-- Status View -->
    <div v-else>
      <h3>My Appointments</h3>
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <div v-else-if="appointments.length === 0" class="alert alert-info">
        No appointments found.
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appt in appointments" :key="appt.id">
            <td>{{ getDoctorName(appt.doctor_id) }}</td>
            <td>{{ formatDate(appt.date) }}</td>
            <td>{{ appt.time }}</td>
            <td>
              <span class="badge" :class="statusClass(appt.status)">
                {{ appt.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {


  data() {
    return {
      activeTab: 'request',
      form: {
        doctor_id: '',
        date: '',
        time: '',
      },
      timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '14:00', '15:00'],
      appointments: [],
      doctors: [],
      loading: false
    }
  },
  async created() {
    await this.fetchDoctors();
    await this.fetchAppointments();
  },
  methods: {
      async fetchDoctors() {
      try {
        // Replace direct axios calls with imported axios
        const response = await axios.get('/api/doctors');
        this.doctors = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch doctors';
      }
    },
  
async fetchAppointments() {
  try {
    const { data } = await this.$appointmentService.getAllAppointments()
    this.appointments = data
  } catch (error) {
    this.$toast.error(error.response?.data?.message || 'Failed to fetch appointments')
  }
},
  async submitRequest() {
  try {
    await this.$appointmentService.createAppointment(this.form)
    this.$toast.success('Appointment requested successfully')
    this.activeTab = 'status'
    await this.fetchAppointments()
  } catch (error) {
    this.$toast.error(error.response?.data?.message || 'Request failed')
  }
},
    getDoctorName(id) {
      const doctor = this.doctors.find(d => d.id === id);
      return doctor ? doctor.name : '';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    statusClass(status) {
      return {
        'bg-warning': status === 'pending',
        'bg-success': status === 'approved',
        'bg-danger': status === 'rejected'
      };
    }
  }
}
</script>