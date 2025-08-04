<template>
  <div class="container py-4">
    <h3>All Doctors</h3>

    <table class="table table-hover mt-3">
      <thead class="thead-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Specialization</th>
          <th>Availability</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(doctor, index) in doctors" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ doctor.name }}</td>
          <td>{{ doctor.specialization }}</td>
          <td>
            <ul class="mb-0">
              <li v-for="day in doctor.availability" :key="day">{{ day }}</li>
            </ul>
          </td>
          <td>
            <span
              class="badge"
              :class="doctor.active ? 'bg-success' : 'bg-secondary'"
            >
              {{ doctor.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-warning me-1" @click="editDoctor(index)">
              Edit
            </button>
            <button
              class="btn btn-sm"
              :class="doctor.active ? 'btn-danger' : 'btn-success'"
              @click="toggleStatus(index)"
            >
              {{ doctor.active ? 'Deactivate' : 'Reactivate' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <router-link to="/doctors/new" class="btn btn-primary mt-3">
      + Add New Doctor
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    doctors() {
      return this.$store.state.doctors.list || [];
    },
  },
  methods: {
    toggleStatus(index) {
      this.$store.commit('doctors/TOGGLE_DOCTOR_STATUS', index);
    },
    editDoctor(index) {
      this.$router.push({ name: 'EditDoctor', params: { id: index } });
    },
  },
};
</script>
