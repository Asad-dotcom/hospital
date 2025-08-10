<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
      <p>Loading medicines...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Medicine Inventory</h3>
        <router-link to="/inventory/medicine-form" class="btn btn-primary">
          <i class="bi bi-plus"></i> Add New Medicine
        </router-link>
      </div>

      <div v-if="medicines.length === 0" class="alert alert-info">
        No medicines found.
      </div>
      
      <table v-else class="table table-bordered table-hover">
        <thead class="thead-light">
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="medicine in medicines" :key="medicine.id">
            <td>{{ medicine.name }}</td>
            <td>{{ medicine.brand }}</td>
            <td>{{ medicine.stock }}</td>
            <td>{{ formatCurrency(medicine.price) }}</td>
            <td>{{ formatDate(medicine.expiry_date) }}</td>
            <td>
              <span v-if="isExpired(medicine.expiry_date)" class="badge bg-danger">Expired</span>
              <span v-else-if="isNearExpiry(medicine.expiry_date)" class="badge bg-warning text-dark">Near Expiry</span>
              <span v-else-if="medicine.stock < 10" class="badge bg-info">Low Stock</span>
              <span v-else class="badge bg-success">OK</span>
            </td>
            <td>
              <router-link
                :to="{ name: 'MedicineForm', query: { id: medicine.id } }"
                class="btn btn-sm btn-secondary me-2"
              >
                Edit
              </router-link>
              <button 
                @click="confirmDelete(medicine.id)"
                class="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import medicineService from '@/api/services/medicineService'

export default {
  data() {
    return {
      medicines: [],
      loading: false,
      error: null
    }
  },

  beforeRouteEnter(to, from, next) {
    console.log('Navigating to /inventory');
    next(vm => {
      vm.fetchMedicines(); // call after component is created
    });
  },
  methods: {
   async fetchMedicines() {
      console.log('Attempting to fetch medicines from API');
      this.loading = true;
      this.error = null;

      try {
        const response = await medicineService.getAllMedicines();
        console.log('API Response:', response);

        if (response && response.data && Array.isArray(response.data.data)) {
          this.medicines = response.data.data;
        } else {
          this.medicines = [];
        }
      } catch (error) {
        console.error('API Error:', error);
        this.error = error.response?.data?.message || error.message || 'Failed to load medicines';
        if (this.$toast) {
          this.$toast.error(this.error);
        }
      } finally {
        this.loading = false;
        console.log('Fetch operation completed');
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount || 0)
    },
    isExpired(dateStr) {
      if (!dateStr) return false
      return new Date(dateStr) < new Date()
    },
    isNearExpiry(dateStr) {
      if (!dateStr) return false
      const today = new Date()
      const expiry = new Date(dateStr)
      const diffDays = (expiry - today) / (1000 * 60 * 60 * 24)
      return diffDays < 30 && diffDays > 0
    },
    confirmDelete(id) {
      if (confirm('Are you sure you want to delete this medicine?')) {
        this.deleteMedicine(id)
      }
    },
    async deleteMedicine(id) {
      try {
        await medicineService.deleteMedicine(id)
        this.$toast.success('Medicine deleted successfully')
        await this.fetchMedicines()
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to delete medicine')
      }
    }
  }
}
</script>

<style scoped>
.table th {
  white-space: nowrap;
}
.badge {
  font-size: 0.85em;
}
</style>