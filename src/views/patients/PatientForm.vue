<template>
  <div class="container py-4">
    <h3>{{ isEditMode ? 'Edit Patient' : 'Register New Patient' }}</h3>

    <form @submit.prevent="savePatient" class="mt-3">
      <div class="form-group mb-3">
        <label>Name</label>
        <input 
          v-model="form.name" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors.name }"
          required 
        />
        <div v-if="errors.name" class="invalid-feedback">
          {{ errors.name }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Email</label>
        <input 
          v-model="form.email" 
          type="email" 
          class="form-control" 
          :class="{ 'is-invalid': errors.email }"
          required 
        />
        <div v-if="errors.email" class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Phone</label>
        <input 
          v-model="form.phone" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors.phone }"
        />
        <div v-if="errors.phone" class="invalid-feedback">
          {{ errors.phone }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Gender</label>
        <select 
          v-model="form.gender" 
          class="form-control" 
          :class="{ 'is-invalid': errors.gender }"
        >
          <option disabled value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <div v-if="errors.gender" class="invalid-feedback">
          {{ errors.gender }}
        </div>
      </div>

      <button type="submit" class="btn btn-success">{{ isEditMode ? 'Update' : 'Register' }}</button>
      <router-link to="/patients" class="btn btn-secondary ms-2">Cancel</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        gender: '',
        active: true,
      },
      formIndex: null,
      errors: {}
    };
  },
  computed: {
    isEditMode() {
      return this.$route.name === 'EditPatient';
    },
  },
  mounted() {
    if (this.isEditMode) {
      const id = this.$route.params.id;
      const patient = this.$store.state.patients.list[id];
      if (patient) {
        this.form = { ...patient };
        this.formIndex = id;
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {};
      
      // Name validation
      if (!this.form.name) {
        this.errors.name = 'Name is required';
      } else if (this.form.name.length < 2) {
        this.errors.name = 'Name must be at least 2 characters';
      }
      
      // Email validation
      if (!this.form.email) {
        this.errors.email = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }
      
      // Phone validation (optional but if provided, should be valid)
      if (this.form.phone && !/^[0-9+\-\s()]+$/.test(this.form.phone)) {
        this.errors.phone = 'Please enter a valid phone number';
      }
      
      // Gender validation
      if (!this.form.gender) {
        this.errors.gender = 'Please select a gender';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    savePatient() {
      if (this.validateForm()) {
        if (this.isEditMode) {
          this.$store.commit('patients/UPDATE_PATIENT', {
            index: this.formIndex,
            data: this.form,
          });
        } else {
          this.$store.commit('patients/ADD_PATIENT', this.form);
        }
        this.$router.push('/patients');
      }
    },
  },
};
</script>
