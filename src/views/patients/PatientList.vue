<template>
  <div class="container py-4">
    <h3>All Patients</h3>

    <table class="table table-bordered table-hover mt-3">
      <thead class="thead-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(patient, index) in patients" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ patient.name }}</td>
          <td>{{ patient.email }}</td>
          <td>
            <span
              class="badge"
              :class="patient.active ? 'bg-success' : 'bg-secondary'"
            >
              {{ patient.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <button
              class="btn btn-sm btn-warning me-1"
              @click="editPatient(index)"
            >
              Edit
            </button>
            <button
              class="btn btn-sm"
              :class="patient.active ? 'btn-danger' : 'btn-success'"
              @click="toggleStatus(index)"
            >
              {{ patient.active ? 'Deactivate' : 'Reactivate' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <router-link to="/patients/new" class="btn btn-primary mt-3">
      + Add New Patient
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    patients() {
      return this.$store.state.patients.list || [];
    },
    loading() {
      return this.$store.state.patients.loading;
    },
    error() {
      return this.$store.state.patients.error;
    },
  },
  methods: {
    toggleStatus(index) {
      this.$store.commit('patients/TOGGLE_PATIENT_STATUS', index);
    },
    editPatient(index) {
      this.$router.push({ name: 'EditPatient', params: { id: index } });
    },
  },
  async created() {
    await this.$store.dispatch('patients/fetchPatients');
  },
};
</script>
