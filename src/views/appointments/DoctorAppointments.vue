<template>
  <div class="container py-4">
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'calendar' }"
          @click="activeTab = 'calendar'"
        >
          Calendar
        </button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'approvals' }"
          @click="activeTab = 'approvals'"
        >
          Approvals
        </button>
      </li>
    </ul>

    <!-- Calendar View -->
    <div v-if="activeTab === 'calendar'">
      <div class="d-flex justify-content-between mb-3">
        <h3>Appointment Calendar</h3>
        <div>
          <button class="btn btn-sm btn-outline-secondary me-2" @click="prevWeek">
            &lt; Previous
          </button>
          <span class="fw-bold">{{ weekRange }}</span>
          <button class="btn btn-sm btn-outline-secondary ms-2" @click="nextWeek">
            Next &gt;
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Time</th>
              <th v-for="day in weekDays" :key="day.date">
                {{ day.name }}<br>{{ day.date }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="time in timeSlots" :key="time">
              <td>{{ time }}</td>
              <td v-for="day in weekDays" :key="day.date">
                <div v-for="appt in getAppointments(day.date, time)" :key="appt.id" 
                     class="appointment-badge" :class="statusClass(appt.status)">
                  {{ appt.patient_name }}
                  <span class="status-indicator">{{ appt.status }}</span>
                  <button v-if="appt.status === 'pending'" class="btn-close btn-close-white btn-sm" 
                          @click.stop="updateStatus(appt.id, 'rejected')"></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Approvals View -->
    <div v-else>
      <h3 class="mb-3">Pending Approvals</h3>
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status"></div>
      </div>
      <div v-else-if="pendingAppointments.length === 0" class="alert alert-info">
        No pending approvals.
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appt in pendingAppointments" :key="appt.id">
              <td>{{ appt.patient_name }}</td>
              <td>{{ formatDate(appt.date) }}</td>
              <td>{{ appt.time }}</td>
              <td>
                <button class="btn btn-sm btn-success me-2" @click="updateStatus(appt.id, 'approved')">
                  Approve
                </button>
                <button class="btn btn-sm btn-danger" @click="updateStatus(appt.id, 'rejected')">
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import appointmentService from '@/api/services/appointmentService'

export default {
  data() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      activeTab: 'calendar',
      currentWeekStart: new Date(today.setDate(today.getDate() - today.getDay())),
      timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00', '13:00', '14:00', '15:00'],
      appointments: [],
      loading: false,
      error: null
    }
  },
  computed: {
    weekDays() {
      const days = [];
      const start = new Date(this.currentWeekStart);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        
        days.push({
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: date.toISOString().split('T')[0]
        });
      }
      
      return days;
    },
    weekRange() {
      const start = new Date(this.currentWeekStart);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    },
    pendingAppointments() {
      return this.appointments.filter(a => a.status === 'pending');
    }
  },
   async created() {
    await this.fetchAppointments();
  },
  methods: {
    async fetchAppointments() {
  this.loading = true;
  this.error = null;
  try {
    const response = await appointmentService.getAllAppointments();
    console.log('API Response:', response); // Debug log
    
    // Ensure we're working with an array
    this.appointments = Array.isArray(response.data) 
      ? response.data 
      : Object.values(response.data || {});
    
    console.log('Processed appointments:', this.appointments); // Debug log
  } catch (error) {
    console.error('Error fetching appointments:', error);
    this.error = error.response?.data?.message || 'Failed to load appointments';
    this.$toast.error(this.error);
  } finally {
    this.loading = false;
  }
},
    prevWeek() {
      const date = new Date(this.currentWeekStart);
      date.setDate(date.getDate() - 7);
      this.currentWeekStart = date;
    },
    nextWeek() {
      const date = new Date(this.currentWeekStart);
      date.setDate(date.getDate() + 7);
      this.currentWeekStart = date;
    },
    getAppointments(date, time) {
      return this.appointments.filter(a => 
        a.date === date && 
        a.time === time &&
        a.status !== 'rejected'
      );
    },
    async updateStatus(id, status) {
    try {
      await this.$appointmentService.updateAppointmentStatus(id, status)
      this.$toast.success(`Appointment ${status}`)
      await this.fetchAppointments()
    } catch (error) {
      this.$toast.error(error.response?.data?.message || 'Update failed')
    }
  },
   async deleteAppointment(id) {
    try {
      await this.$appointmentService.deleteAppointment(id)
      this.$toast.success('Appointment deleted')
      await this.fetchAppointments()
    } catch (error) {
      this.$toast.error(error.response?.data?.message || 'Delete failed')
    }
  },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    statusClass(status) {
      return {
        'bg-primary': status === 'approved',
        'bg-warning': status === 'pending'
      };
    }
  }
}

</script>

<style scoped>
.appointment-badge {
  padding: 2px 5px;
  margin: 2px 0;
  border-radius: 3px;
  color: white;
  font-size: 0.8rem;
}
.status-indicator {
  font-size: 0.7rem;
  opacity: 0.8;
  margin-left: 5px;
}
</style>