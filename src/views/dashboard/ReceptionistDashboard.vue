<template>
  <div class="container py-4">
    <h2>Receptionist Dashboard</h2>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Patient Management</h5>
            <p class="card-text">Register new patients and manage patient records.</p>
            <router-link to="/patients" class="btn btn-primary">Manage Patients</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Appointment Requests</h5>
            <p class="card-text">View and process appointment requests.</p>
            <router-link to="/appointments/request" class="btn btn-warning">View Requests</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Billing</h5>
            <p class="card-text">Create and manage billing records.</p>
            <router-link to="/billing/new" class="btn btn-success">Create Billing</router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Prescriptions</h5>
            <p class="card-text">View and manage prescriptions.</p>
            <router-link to="/billing/prescriptions" class="btn btn-info">View Prescriptions</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Document Upload</h5>
            <p class="card-text">Upload patient medical documents.</p>
            <router-link to="/patients/upload" class="btn btn-secondary">Upload Documents</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Appointment Calendar</h5>
            <p class="card-text">View upcoming appointments.</p>
            <router-link to="/appointments/calendar" class="btn btn-danger">View Calendar</router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Today's Appointments</h5>
          </div>
          <div class="card-body">
            <p>No appointments scheduled for today.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReceptionistDashboard',
  data() {
    return {
      // Dashboard data can be added here
    };
  },
  mounted() {
    // Initialize dashboard data when component is mounted
  },
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
