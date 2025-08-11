<template>
  <div class="billing-dashboard">
    <div class="container py-4">
      <h2 class="mb-4">Billing Management</h2>
      
      <nav class="nav nav-pills mb-4">
        <router-link 
          to="/billing/pending" 
          class="nav-link" 
          active-class="active"
        >
          Pending Appointments
        </router-link>
        <router-link 
          to="/billing/new" 
          class="nav-link" 
          active-class="active"
        >
          Create Bill
        </router-link>
        <router-link 
          to="/billing/history" 
          class="nav-link" 
          active-class="active"
        >
          Billing History
        </router-link>
        <router-link 
          to="/billing/prescriptions" 
          class="nav-link" 
          active-class="active"
        >
          Prescriptions
        </router-link>
      </nav>
      
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BillingDashboard'
}
</script>

<style scoped>
.nav-pills .nav-link.active {
  background-color: #0d6efd;
  color: white;
}
.billing-dashboard {
  background-color: #f8f9fa;
  min-height: 100vh;
}
</style>