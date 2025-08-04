<template>
  <div class="container py-4">
    <h3>Request an Appointment</h3>

    <div v-if="alertMessage" :class="`alert alert-${alertType} mt-3`">
      {{ alertMessage }}
    </div>

    <form @submit.prevent="submitRequest" class="mt-3">
      <div class="form-group mb-3">
        <label for="doctor">Select Doctor</label>
        <select v-model="form.doctor" class="form-control" required>
          <option disabled value="">-- Choose --</option>
          <option v-for="doc in doctors" :key="doc.name" :value="doc.name">
            {{ doc.name }} - {{ doc.specialization }}
          </option>
        </select>
        <div v-if="errors.doctor" class="text-danger">{{ errors.doctor }}</div>
      </div>

      <div class="form-group mb-3">
        <label>Date</label>
        <input type="date" v-model="form.date" class="form-control" required />
        <div v-if="errors.date" class="text-danger">{{ errors.date }}</div>
      </div>

      <div class="form-group mb-3">
        <label>Time Slot</label>
        <select v-model="form.time" class="form-control" required>
          <option disabled value="">-- Choose Time --</option>
          <option v-for="slot in timeSlots" :key="slot">{{ slot }}</option>
        </select>
        <div v-if="errors.time" class="text-danger">{{ errors.time }}</div>
      </div>

      <button class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
        {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        doctor: '',
        date: '',
        time: '',
        status: 'Pending',
      },
      timeSlots: [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM',
        '02:00 PM', '03:00 PM',
      ],
      errors: {},
      isSubmitting: false,
      alertMessage: '',
      alertType: 'info',
    };
  },
  computed: {
    doctors() {
      return this.$store.state.doctors.list.filter(d => d.active);
    },
  },
  methods: {
    validateForm() {
      this.errors = {};
      
      if (!this.form.doctor) {
        this.errors.doctor = 'Please select a doctor';
      }
      
      if (!this.form.date) {
        this.errors.date = 'Please select a date';
      } else {
        const selectedDate = new Date(this.form.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          this.errors.date = 'Please select a future date';
        }
      }
      
      if (!this.form.time) {
        this.errors.time = 'Please select a time slot';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    checkAppointmentOverlap() {
      // Check if there's already an appointment with the same doctor, date, and time
      const existingAppointment = this.$store.state.appointments.list.find(appt => 
        appt.doctor === this.form.doctor &&
        appt.date === this.form.date &&
        appt.time === this.form.time
      );
      
      return !!existingAppointment;
    },
    submitRequest() {
      if (!this.validateForm()) {
        return;
      }
      
      if (this.checkAppointmentOverlap()) {
        this.alertMessage = 'This time slot is already booked. Please choose another time.';
        this.alertType = 'danger';
        return;
      }
      
      this.isSubmitting = true;
      this.alertMessage = '';
      
      // Simulate API call delay
      setTimeout(() => {
        try {
          this.$store.commit('appointments/ADD_APPOINTMENT', this.form);
          
          // Show success message
          this.alertMessage = 'Appointment requested successfully!';
          this.alertType = 'success';
          
          // Reset form
          this.form = {
            doctor: '',
            date: '',
            time: '',
            status: 'Pending',
          };
          
          // Trigger real-time notification (in a real app, this would come from backend via WebSocket)
          this.$store.commit('appointments/SET_NEW_APPOINTMENT_ALERT', true);
          
          // Redirect after a short delay
          setTimeout(() => {
            this.$router.push('/appointments/status');
          }, 2000);
        } catch (error) {
          this.alertMessage = 'Failed to submit appointment request. Please try again.';
          this.alertType = 'danger';
        } finally {
          this.isSubmitting = false;
        }
      }, 500);
    },
  },
};
</script>
