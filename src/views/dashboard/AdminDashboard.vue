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
            <button class="btn btn-outline-primary btn-sm" @click="handleManage(card.title)">Manage</button>
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
        },
        {
          title: 'Doctors',
          icon: 'bi bi-person-badge-fill',
          description: 'Manage doctor profiles and availability',
        },
        {
          title: 'Appointments',
          icon: 'bi bi-calendar-check-fill',
          description: 'Review and approve appointments',
        },
        {
          title: 'Inventory',
          icon: 'bi bi-box-seam',
          description: 'Track medicine and stock levels',
        },
        {
          title: 'Billing',
          icon: 'bi bi-receipt-cutoff',
          description: 'Generate and view billing records',
        },
        {
          title: 'Prescriptions',
          icon: 'bi bi-file-earmark-medical-fill',
          description: 'Manage prescriptions and downloads',
        },
      ],
    };
  },
  methods: {
    handleManage(title) {
      switch (title) {
        case 'Patients':
          this.$router.push('/patients');
          break;
        case 'Doctors':
          this.$router.push('/doctors');
          break;
        case 'Appointments':
          alert('Access denied: Appointments management is restricted to doctors.');
          break;
        case 'Inventory':
          alert('Access denied: Inventory management is restricted to pharmacists.');
          break;
        case 'Billing':
          alert('Access denied: Billing management is restricted to receptionists.');
          break;
        case 'Prescriptions':
          alert('Access denied: Prescription management is restricted to doctors.');
          break;
        default:
          break;
      }
    },
  },
};
</script>
