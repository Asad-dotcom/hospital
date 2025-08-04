<template>
  <div class="container py-4">
    <h3>{{ isEditMode ? 'Edit Doctor' : 'Register New Doctor' }}</h3>

    <form @submit.prevent="saveDoctor" class="mt-3">
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
        <label>Specialization</label>
        <input
          v-model="form.specialization"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.specialization }"
          placeholder="e.g. Cardiologist"
        />
        <div v-if="errors.specialization" class="invalid-feedback">
          {{ errors.specialization }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Weekly Availability</label>
        <div class="form-check" v-for="day in daysOfWeek" :key="day">
          <input
            class="form-check-input"
            type="checkbox"
            :id="day"
            :value="day"
            v-model="form.availability"
          />
          <label class="form-check-label" :for="day">{{ day }}</label>
        </div>
        <div v-if="errors.availability" class="text-danger mt-1">
          {{ errors.availability }}
        </div>
      </div>

      <button type="submit" class="btn btn-success">{{ isEditMode ? 'Update' : 'Register' }}</button>
      <router-link to="/doctors" class="btn btn-secondary ms-2">Cancel</router-link>
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
        specialization: '',
        availability: [],
        active: true,
      },
      formIndex: null,
      daysOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      errors: {},
    };
  },
  computed: {
    isEditMode() {
      return this.$route.name === 'EditDoctor';
    },
  },
  mounted() {
    if (this.isEditMode) {
      const id = this.$route.params.id;
      const doctor = this.$store.state.doctors.list[id];
      if (doctor) {
        this.form = { ...doctor };
        this.formIndex = id;
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.name) {
        this.errors.name = 'Name is required';
      } else if (this.form.name.length < 2) {
        this.errors.name = 'Name must be at least 2 characters';
      }

      if (!this.form.email) {
        this.errors.email = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }

      if (!this.form.specialization) {
        this.errors.specialization = 'Specialization is required';
      }

      if (!this.form.availability.length) {
        this.errors.availability = 'Please select at least one day of availability';
      }

      return Object.keys(this.errors).length === 0;
    },
    saveDoctor() {
      if (this.validateForm()) {
        if (this.isEditMode) {
          this.$store.commit('doctors/UPDATE_DOCTOR', {
            index: this.formIndex,
            data: this.form,
          });
        } else {
          this.$store.commit('doctors/ADD_DOCTOR', this.form);
        }
        this.$router.push('/doctors');
      }
    },
  },
};
</script>
