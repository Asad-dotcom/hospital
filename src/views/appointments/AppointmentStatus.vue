<template>
  <div class="container py-4">
    <h3>Your Appointments</h3>

    <div v-if="appointments.length === 0" class="alert alert-info mt-3">
      No appointments found.
    </div>

    <table v-else class="table table-hover mt-3">
      <thead>
        <tr>
          <th>Doctor</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(appt, index) in appointments" :key="index">
          <td>{{ appt.doctor }}</td>
          <td>{{ appt.date }}</td>
          <td>{{ appt.time }}</td>
          <td>
            <span
              class="badge"
              :class="{
                'bg-success': appt.status === 'Approved',
                'bg-danger': appt.status === 'Rejected',
                'bg-warning text-dark': appt.status === 'Pending'
              }"
            >
              {{ appt.status }}
            </span>
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
      // In a real app, you'd filter by patient identity
      return this.$store.state.appointments.list;
    },
  },
};
</script>
