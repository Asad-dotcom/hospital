<template>
  <div class="container py-4">
    <h3>Appointment Calendar</h3>

    <div v-if="appointments.length === 0" class="alert alert-info mt-3">
      No appointments yet.
    </div>

    <div class="table-responsive mt-3" v-else>
      <table class="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Doctor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(appt, index) in sortedAppointments" :key="index">
            <td>{{ appt.date }}</td>
            <td>{{ appt.time }}</td>
            <td>{{ appt.doctor }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-warning': appt.status === 'Pending',
                  'bg-success': appt.status === 'Approved',
                  'bg-danger': appt.status === 'Rejected',
                }"
              >
                {{ appt.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    appointments() {
      return this.$store.state.appointments.list;
    },
    sortedAppointments() {
      return this.appointments.slice().sort((a, b) => {
        return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
      });
    },
  },
};
</script>
