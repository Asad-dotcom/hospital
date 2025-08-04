<template>
  <div class="container py-4">
    <h3>Approve or Reject Appointments</h3>

    <div v-if="pendingAppointments.length === 0" class="alert alert-secondary mt-3">
      No pending appointments to review.
    </div>

    <table v-else class="table table-striped mt-3">
      <thead>
        <tr>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(appt, index) in pendingAppointments" :key="index">
          <td>{{ appt.patient || 'Unknown' }}</td>
          <td>{{ appt.doctor }}</td>
          <td>{{ appt.date }}</td>
          <td>{{ appt.time }}</td>
          <td>
            <span class="badge bg-warning text-dark">{{ appt.status }}</span>
          </td>
          <td>
            <button class="btn btn-sm btn-success me-2" @click="updateStatus(index, 'Approved')">
              Approve
            </button>
            <button class="btn btn-sm btn-danger" @click="updateStatus(index, 'Rejected')">
              Reject
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    appointments() {
      return this.$store.state.appointments.list;
    },
    pendingAppointments() {
      return this.appointments
        .map((a, i) => ({ ...a, index: i }))
        .filter((a) => a.status === 'Pending');
    },
  },
  methods: {
    updateStatus(index, newStatus) {
      this.$store.commit('appointments/UPDATE_APPOINTMENT_STATUS', {
        index,
        status: newStatus,
      });
    },
  },
};
</script>
