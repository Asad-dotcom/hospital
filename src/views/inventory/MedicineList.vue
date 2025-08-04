<template>
  <div class="container py-4">
    <h3>Medicine Inventory</h3>

    <router-link to="/inventory/medicine-form" class="btn btn-primary mb-3">
      Add New Medicine
    </router-link>

    <div v-if="medicines.length === 0" class="alert alert-info">
      No medicines in inventory.
    </div>

    <table v-else class="table table-bordered table-hover">
      <thead class="thead-light">
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Expiry Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(med, index) in medicines" :key="index">
          <td>{{ med.name }}</td>
          <td>{{ med.quantity }}</td>
          <td>{{ med.expiry }}</td>
          <td>
            <span v-if="isExpired(med.expiry)" class="badge bg-danger">Expired</span>
            <span v-else-if="isNearExpiry(med.expiry)" class="badge bg-warning text-dark">Near Expiry</span>
            <span v-else-if="med.quantity < 5" class="badge bg-info">Low Stock</span>
            <span v-else class="badge bg-success">OK</span>
          </td>
          <td>
            <router-link
              :to="{ path: '/inventory/medicine-form', query: { edit: index } }"
              class="btn btn-sm btn-secondary"
            >
              Edit
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    medicines() {
      return this.$store.state.inventory.medicines;
    },
  },
  methods: {
    isExpired(dateStr) {
      return new Date(dateStr) < new Date();
    },
    isNearExpiry(dateStr) {
      const today = new Date();
      const expiry = new Date(dateStr);
      const diff = (expiry - today) / (1000 * 60 * 60 * 24);
      return diff < 15 && diff > 0;
    },
  },
};
</script>
