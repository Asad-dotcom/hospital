<template>
  <div class="container py-5">
    <h2 class="mb-4">Admin Dashboard</h2>
    <div class="row g-4">
      <div class="col-md-4" v-for="card in cards" :key="card.title">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <i :class="card.icon" class="display-4 mb-3 text-primary"></i>
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text">{{ card.description }}</p>
            <button 
              class="btn btn-outline-primary btn-sm" 
              @click="handleNavigation(card.route)"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          title: 'Patients',
          icon: 'bi bi-people-fill',
          description: 'Register and view patient information',
          route: '/patients'
        },
        {
          title: 'Doctors',
          icon: 'bi bi-person-badge-fill',
          description: 'Manage doctor profiles and availability',
          route: '/doctors'
        },
        {
          title: 'Appointments',
          icon: 'bi bi-calendar-check-fill',
          description: 'Review and approve appointments',
          route: '/appointments'
        },
        {
          title: 'Inventory',
          icon: 'bi bi-box-seam',
          description: 'Track medicine and stock levels',
          route: '/inventory'
        },
        {
          title: 'Billing',
          icon: 'bi bi-receipt-cutoff',
          description: 'Generate and view billing records',
          route: '/billing'
        },
        {
          title: 'Prescriptions',
          icon: 'bi bi-file-earmark-medical-fill',
          description: 'Manage prescriptions and downloads',
          route: '/prescriptions'
        }
      ]
    };
  },
  methods: {
    handleNavigation(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
  min-height: 250px;
  display: flex;
  flex-direction: column;
}
.card:hover {
  transform: translateY(-5px);
}
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.btn {
  align-self: center;
}
</style>
