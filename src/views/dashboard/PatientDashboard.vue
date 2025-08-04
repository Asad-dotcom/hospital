<template>
  <div class="container py-5">
    <h2 class="mb-4">Patient Dashboard</h2>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card shadow-sm border-start border-info border-4">
          <div class="card-body text-center">
            <i class="bi bi-calendar-plus display-4 text-info mb-3"></i>
            <h5 class="card-title">Book Appointment</h5>
            <p class="card-text">Request a new appointment with available doctors.</p>
            <button class="btn btn-outline-info btn-sm" @click="bookAppointment">Book Now</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-start border-warning border-4">
          <div class="card-body text-center">
            <i class="bi bi-clock-history display-4 text-warning mb-3"></i>
            <h5 class="card-title">Medical History</h5>
            <p class="card-text">Review your past visits, reports, and prescriptions.</p>
            <button class="btn btn-outline-warning btn-sm" @click="viewHistory">View History</button>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm border-start border-success border-4">
          <div class="card-body text-center">
            <i class="bi bi-cloud-arrow-down display-4 text-success mb-3"></i>
            <h5 class="card-title">Documents</h5>
            <p class="card-text">Download or upload medical reports and files.</p>
            <button class="btn btn-outline-success btn-sm" @click="accessFiles">Access Files</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    bookAppointment() {
      this.$router.push('/appointments/request');
    },
    viewHistory() {
      this.$router.push('/patients/history');
    },
    accessFiles() {
      this.$router.push('/patients/upload');
    },
  },
};
</script>
