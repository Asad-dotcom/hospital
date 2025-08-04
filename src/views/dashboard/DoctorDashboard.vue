<template>
  <div class="container py-5">
    <h2 class="mb-4">Doctor Dashboard</h2>
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card text-white bg-success shadow-sm">
          <div class="card-body">
            <h5 class="card-title"><i class="bi bi-calendar-heart me-2"></i>My Appointments</h5>
            <p class="card-text">View and manage your upcoming appointments.</p>
            <button class="btn btn-light btn-sm" @click="viewSchedule">View Schedule</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card text-white bg-primary shadow-sm">
          <div class="card-body">
            <h5 class="card-title"><i class="bi bi-journal-medical me-2"></i>Prescriptions</h5>
            <p class="card-text">Create or review prescriptions for patients.</p>
            <button class="btn btn-light btn-sm" @click="managePrescriptions">Manage</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    viewSchedule() {
      this.$router.push('/appointments/calendar');
    },
    managePrescriptions() {
      this.$router.push('/billing/prescriptions');
    },
  },
};
</script>
