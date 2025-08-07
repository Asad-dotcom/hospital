<template>
  <div class="container py-4">
    <h3>All Patients</h3>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <table v-if="!loading && !error" class="table table-bordered table-hover mt-3">
      <thead class="thead-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Gender</th>
          <th>Date of Birth</th>
          <th>Address</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(patient, index) in patients" :key="patient.id || index">
          <td>{{ index + 1 }}</td>
          <td>{{ patient.name }}</td>
          <td>{{ patient.email }}</td>
          <td>{{ patient.phone || 'N/A' }}</td>
          <td>{{ patient.gender || 'N/A' }}</td>
          <td>{{ formatDate(patient.dob) || 'N/A' }}</td>
          <td>{{ patient.address || 'N/A' }}</td>
          <td>{{ formatDate(patient.created_at) || 'N/A' }}</td>
          <td>
            <button
              class="btn btn-sm btn-warning me-1"
              @click="editPatient(patient)"
              title="Edit"
            >
              Edit
            </button>
            <button
              class="btn btn-sm btn-danger me-1"
              @click="deletePatient(patient)"
              title="Delete"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && !error && patients.length === 0" class="text-center">
      <p>No patients found.</p>
    </div>

    <router-link to="/patients/new" class="btn btn-primary mt-3">
      + Add New Patient
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      error: null,
    };
  },
  computed: {
    patients() {
      return this.$store.getters['patients/patients'] || [];
    },
  },
  async created() {
    this.loading = true;
    try {
      await this.$store.dispatch('patients/fetchPatients');
    } catch (err) {
      this.error = 'Failed to load patients.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    editPatient(patient) {
      this.$router.push({ name: 'EditPatient', params: { id: patient.id } });
    },
    async deletePatient(patient) {
      if (confirm(`Are you sure you want to delete patient "${patient.name}"?`)) {
        try {
          await this.$store.dispatch('patients/deletePatient', patient.id);
          this.$toast.success('Patient deleted successfully');
        } catch (err) {
          console.error('Failed to delete patient:', err);
          this.$toast.error('Failed to delete patient');
        }
      }
    },
  },
};
</script>
