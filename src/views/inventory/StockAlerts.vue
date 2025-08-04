<template>
  <div class="container py-4">
    <h3>Stock & Expiry Alerts</h3>

    <div class="row mb-3">
      <div class="col-md-4">
        <div class="card text-white bg-danger">
          <div class="card-body">
            <h5 class="card-title">Low Stock</h5>
            <p class="card-text display-6">{{ lowStockCount }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-warning">
          <div class="card-body">
            <h5 class="card-title">Near Expiry</h5>
            <p class="card-text display-6">{{ nearExpiryCount }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-white bg-secondary">
          <div class="card-body">
            <h5 class="card-title">Expired</h5>
            <p class="card-text display-6">{{ expiredCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="alerts.length === 0" class="alert alert-success mt-3">
      All medicines are in good condition.
    </div>

    <div v-else>
      <ul class="list-group mt-3">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="(alert, i) in alerts"
          :key="i"
        >
          <div>
            <strong>{{ alert.name }}</strong>
            <br>
            <span class="text-muted">{{ alert.expiry }}</span>
          </div>
          <span 
            :class="`badge rounded-pill ${getAlertClass(alert.reason)}`"
          >
            {{ alert.reason }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    medicines() {
      return this.$store.state.inventory.medicines;
    },
    alerts() {
      const today = new Date();
      return this.medicines
        .map((med) => {
          const expiry = new Date(med.expiry);
          const daysLeft = (expiry - today) / (1000 * 60 * 60 * 24);
          if (med.quantity < 5) {
            return { name: med.name, expiry: med.expiry, reason: 'Low stock' };
          } else if (daysLeft < 15 && daysLeft > 0) {
            return { name: med.name, expiry: med.expiry, reason: 'Near expiry' };
          } else if (daysLeft <= 0) {
            return { name: med.name, expiry: med.expiry, reason: 'Expired' };
          }
          return null;
        })
        .filter(Boolean);
    },
    lowStockCount() {
      return this.alerts.filter(alert => alert.reason === 'Low stock').length;
    },
    nearExpiryCount() {
      return this.alerts.filter(alert => alert.reason === 'Near expiry').length;
    },
    expiredCount() {
      return this.alerts.filter(alert => alert.reason === 'Expired').length;
    },
  },
  methods: {
    getAlertClass(reason) {
      switch (reason) {
        case 'Low stock':
          return 'bg-danger';
        case 'Near expiry':
          return 'bg-warning text-dark';
        case 'Expired':
          return 'bg-secondary';
        default:
          return 'bg-info';
      }
    },
  },
};
</script>
