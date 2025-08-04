<template>
  <div class="container py-4">
    <h3>Create Bill</h3>

    <form @submit.prevent="submitBill">
      <div class="form-group mb-3">
        <label>Patient Name</label>
        <input v-model="form.patient" class="form-control" required />
      </div>

      <div class="form-group mb-3">
        <label>Appointment ID</label>
        <input v-model="form.appointmentId" class="form-control" required />
      </div>

      <div class="form-group mb-3">
        <label>Services</label>
        <div v-for="(item, index) in availableServices" :key="index" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="item.name"
            :value="item"
            v-model="form.services"
          />
          <label class="form-check-label" :for="item.name">
            {{ item.name }} (Rs {{ item.cost }})
          </label>
        </div>
      </div>

      <div class="alert alert-info">
        <strong>Total: </strong> Rs {{ total }}
      </div>

      <button type="submit" class="btn btn-success">Generate Bill</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        patient: '',
        appointmentId: '',
        services: [],
      },
      availableServices: [
        { name: 'Consultation', cost: 500 },
        { name: 'Blood Test', cost: 1000 },
        { name: 'X-Ray', cost: 1200 },
        { name: 'Medicine', cost: 800 },
      ],
    };
  },
  computed: {
    total() {
      return this.form.services.reduce((sum, item) => sum + item.cost, 0);
    },
  },
  methods: {
    submitBill() {
      const newBill = {
        ...this.form,
        total: this.total,
        date: new Date().toLocaleDateString(),
      };
      this.$store.commit('billing/ADD_BILL', newBill);
      alert('Bill generated successfully!');
      this.$router.push('/billing/history');
    },
  },
};
</script>
