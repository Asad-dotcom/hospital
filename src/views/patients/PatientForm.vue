<template>
  <div class="container py-4">
    <h3 class="mb-4">{{ isEditMode ? 'Edit Patient' : 'Add New Patient' }}</h3>

    <form @submit.prevent="submitForm" class="mt-3">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group mb-3">
            <label>Name <span class="text-danger">*</span></label>
            <input v-model="form.name" type="text" class="form-control" required>
          </div>

          <div class="form-group mb-3">
            <label>Email <span class="text-danger">*</span></label>
            <input v-model="form.email" type="email" class="form-control" required>
          </div>

          <div class="form-group mb-3">
            <label>Phone</label>
            <input v-model="form.phone" type="tel" class="form-control">
          </div>

          <div class="form-group mb-3">
            <label>Date of Birth</label>
            <input v-model="form.dob" type="date" class="form-control">
          </div>

          <div class="form-group mb-3">
            <label>Gender</label>
            <select v-model="form.gender" class="form-select">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group mb-3">
            <label>Address</label>
            <textarea v-model="form.address" class="form-control" rows="3"></textarea>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-3">
        <button type="button" @click="cancel" class="btn btn-outline-secondary me-2">Cancel</button>
        <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update' : 'Add' }} Patient</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PatientForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        address: ''
      },
      errors: {}
    };
  },
  computed: {
    isEditMode() {
      return this.$route.params.id !== undefined;
    },
    patientId() {
      return parseInt(this.$route.params.id);
    }
  },
  async created() {
    if (this.isEditMode) {
      await this.loadPatientData();
    }
  },
  methods: {
    async loadPatientData() {
      try {
        const patient = this.$store.getters['patients/getPatientById'](this.patientId);
        if (patient) {
          this.form = { ...patient };
        }
      } catch (error) {
        console.error('Error loading patient:', error);
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required';
        isValid = false;
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email';
        isValid = false;
      }
      
      return isValid;
    },
    async submitForm() {
      if (!this.validateForm()) return;
      
      try {
        const patientData = {
          ...this.form,
          updatedAt: new Date().toISOString()
        };
        
        if (this.isEditMode) {
          await this.$store.dispatch('patients/updatePatient', {
            id: this.patientId,
            data: patientData
          });
        } else {
          patientData.createdAt = new Date().toISOString();
          await this.$store.dispatch('patients/addPatient', patientData);
        }
        
        this.$router.push('/patients');
      } catch (error) {
        console.error('Error saving patient:', error);
        alert('Error saving patient. Please try again.');
      }
    },
    cancel() {
      this.$router.push('/patients');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
