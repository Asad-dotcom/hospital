<template>
  <div class="container py-4">
    <h3>Create Bill</h3>

    <form @submit.prevent="submitBill">
      <div class="form-group mb-3">
        <label>Patient Name</label>
        <input 
          v-model="form.patient" 
          class="form-control" 
          required 
          :disabled="!!appointmentData"
        />
      </div>

      <div class="form-group mb-3">
        <label>Appointment ID</label>
        <input 
          v-model="form.appointmentId" 
          class="form-control" 
          required 
          :disabled="!!appointmentData"
        />
      </div>

      <!-- Rest of your form remains the same -->
    </form>
  </div>
</template>

<script>
import BillingService from '@/api/services/billingService';

export default {
  data() {
    return {
      form: {
        patient: '',
        appointmentId: '',
        services: [],
      },
      appointmentData: null,
      availableServices: [
        { name: 'Consultation', cost: 500 },
        { name: 'Blood Test', cost: 1000 },
        { name: 'X-Ray', cost: 1200 },
        { name: 'Medicine', cost: 800 },
      ],
    };
  },
  computed: {
    total() {
      return this.form.services.reduce((sum, item) => sum + item.cost, 0);
    },
  },
  created() {
    const appointmentId = this.$route.query.appointment;
    if (appointmentId) {
      this.loadAppointmentData(appointmentId);
    }
  },
  methods: {
    async submitBill() {
      try {
        const billData = {
          ...this.form,
          total: this.total,
          date: new Date().toLocaleDateString(),
        };
        await BillingService.createBill(billData);
        this.$toast.success('Bill created successfully!');
        this.$router.push('/billing/history');
      } catch (error) {
        console.error('Error creating bill:', error);
        this.$toast.error('Failed to create bill');
      }
    },
  
    async loadAppointmentData(appointmentId) {
      try {
        const response = await BillingService.getAppointmentDetails(appointmentId);
        this.appointmentData = response.data;
        this.form.patient = this.appointmentData.patientName;
        this.form.appointmentId = this.appointmentData.id;
      } catch (error) {
        console.error('Error loading appointment:', error);
        this.$toast.error('Failed to load appointment data');
      }
    }
  }
};
</script>