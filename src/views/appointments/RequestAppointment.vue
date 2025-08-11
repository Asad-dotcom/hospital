<template>
  <div class="container py-4">
    <h3>Request an Appointment</h3>
    <form @submit.prevent="submitForm" class="mt-3">
      <div class="mb-3">
        <label class="form-label">Doctor</label>
        <select v-model="form.doctor_id" class="form-select" required>
          <option value="">-- Select Doctor --</option>
          <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
            {{ doc.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Date</label>
        <input type="date" v-model="form.date" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Time</label>
        <input type="time" v-model="form.time" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Notes</label>
        <textarea v-model="form.notes" class="form-control"></textarea>
      </div>

      <button class="btn btn-primary" type="submit">Book Appointment</button>
      <router-link to="/dashboard/patient" class="btn btn-secondary ms-2">Cancel</router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import appointmentService from "@/api/services/appointmentService";

export default {
  data() {
    return {
      form: { doctor_id: "", date: "", time: "", notes: "" },
      doctors: []
    };
  },
  async created() {
    await this.loadDoctors();
  },
  methods: {
    async loadDoctors() {
      try {
        const response = await axios.get("/doctors"); // Adjust if API path differs
        this.doctors = response.data;
      } catch (error) {
        console.error("Error loading doctors:", error);
      }
    },
    async submitForm() {
      try {
        await appointmentService.createAppointment({
          doctor_id: this.form.doctor_id,
          appointment_time: `${this.form.date} ${this.form.time}`,
          notes: this.form.notes
        });
        alert("Appointment booked successfully!");
        this.$router.push("/patient/appointments");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to book appointment");
      }
    }
  }
};
</script>
