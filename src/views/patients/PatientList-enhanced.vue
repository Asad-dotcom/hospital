<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>All Patients</h3>
      <div>
        <router-link to="/patients/new" class="btn btn-primary">
          + Add New Patient
        </router-link>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="row mb-3">
      <div class="col-md-6">
        <input 
          v-model="searchQuery" 
          type="text" 
          class="form-control" 
          placeholder="Search patients..."
        />
      </div>
      <div class="col-md-3">
        <select v-model="statusFilter" class="form-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="col-md-3">
        <button class="btn btn-secondary" @click="loadFromLocalStorage">
          Refresh
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Patient Table -->
    <div v-else class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(patient, index) in filteredPatients" :key="patient.id">
            <td>{{ index + 1 }}</td>
            <td>{{ patient.name }}</td>
            <td>{{ patient.email }}</td>
            <td>{{ patient.phone || 'N/A' }}</td>
            <td>{{ patient.gender || 'N/A' }}</td>
            <td>
              <span
                class="badge"
                :class="patient.active ? 'bg-success' : 'bg-secondary'"
              >
                {{ patient.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>{{ formatDate(patient.createdAt) }}</td>
            <td>
              <div class="btn-group" role="group">
                <button
                  class="btn btn-sm btn-warning"
                  @click="editPatient(patient)"
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  class="btn btn-sm"
                  :class="patient.active ? 'btn-danger' : 'btn-success'"
                  @click="toggleStatus(patient)"
                  title="Toggle Status"
                >
                  {{ patient.active ? 'Deactivate' : 'Activate' }}
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deletePatient(patient)"
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No patients message -->
    <div v-if="!loading && !error && filteredPatients.length === 0" class="alert alert-info text-center">
      No patients found. <router-link to="/patients/new">Add your first patient</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      loading: false,
      error: null,
    };
  },
  computed: {
    patients() {
      return this.$store.getters['patients/patients'];
    },
    filteredPatients() {
      let filtered = this.patients;
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(patient =>
          patient.name.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query) ||
          (patient.phone && patient.phone.toLowerCase().includes(query))
        );
      }
      
      // Status filter
      if (this.statusFilter) {
        const isActive = this.statusFilter === 'active';
        filtered = filtered.filter(patient => patient.active === isActive);
      }
      
      return filtered;
    },
  },
  async created() {
    await this.loadFromLocalStorage();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    },
   async loadFromLocalStorage() {
    this.loading = true;
    this.error = null;
    try {
      await this.$store.dispatch('patients/fetchPatients');
      // Show success message if needed
      if (this.patients.length === 0) {
        this.error = 'No patients found.';
      }
    } catch (err) {
      this.error = 'Failed to load patients. Please try again.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  
  async deletePatient(patient) {
    if (confirm(`Are you sure you want to delete patient "${patient.name}"?`)) {
      try {
        await this.$store.dispatch('patients/deletePatient', patient.id);
        // Show success message
        this.$toast.success('Patient deleted successfully');
      } catch (err) {
        console.error('Failed to delete patient:', err);
        this.$toast.error('Error deleting patient. Please try again.');
      }
    }
  },
  
  async toggleStatus(patient) {
    try {
      await this.$store.dispatch('patients/togglePatientStatus', patient.id);
      const newStatus = patient.active ? 'deactivated' : 'activated';
      this.$toast.success(`Patient ${newStatus} successfully`);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      this.$toast.error('Error updating status. Please try again.');
    }
  }
}
}
</script>

<style scoped>
.btn-group .btn {
  margin-right: 2px;
}
.btn-group .btn:last-child {
  margin-right: 0;
}
</style>
