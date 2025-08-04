<template>
  <div class="container py-4">
    <h2>Pharmacist Dashboard</h2>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Inventory Management</h5>
            <p class="card-text">Manage medicines and stock levels.</p>
            <router-link to="/inventory" class="btn btn-primary">View Inventory</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Stock Alerts</h5>
            <p class="card-text">View low stock warnings and expiration alerts.</p>
            <router-link to="/inventory/alerts" class="btn btn-warning">View Alerts</router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Export Data</h5>
            <p class="card-text">Export inventory and transaction data.</p>
            <router-link to="/inventory/export" class="btn btn-success">Export</router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5>Recent Activity</h5>
          </div>
          <div class="card-body">
            <p>No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PharmacistDashboard',
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
