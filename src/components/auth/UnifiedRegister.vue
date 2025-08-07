<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">Sign Up</h3>

            <div v-if="registerStatus.message" :class="`alert alert-${registerStatus.type} mt-3`">
              {{ registerStatus.message }}
            </div>

            <form @submit.prevent="register">
              <div class="form-group mb-3">
                <label>Name</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Enter your name"
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
                  placeholder="Enter your email"
                  required 
                />
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>

              <div class="form-group mb-3">
                <label>Password</label>
                <input 
                  v-model="form.password" 
                  type="password" 
                  class="form-control" 
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="Create a password"
                  required 
                />
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <div class="form-group mb-4">
                <label>Role</label>
                <select 
                  v-model="form.role" 
                  class="form-select"
                  :class="{ 'is-invalid': errors.role }"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="admin" disabled>Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <div v-if="errors.role" class="invalid-feedback">
                  {{ errors.role }}
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-primary w-100" 
                :disabled="isRegistering"
              >
                <span v-if="isRegistering" class="spinner-border spinner-border-sm me-2"></span>
                {{ isRegistering ? 'Creating account...' : 'Sign Up' }}
              </button>
            </form>

            <div class="text-center mt-3">
              <p class="mb-2">
                <router-link to="/login" class="btn btn-link">Already have an account? Sign In</router-link>
              </p>
              <router-link to="/" class="btn btn-link">Back to Home</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnifiedRegister',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        role: ''
      },
      errors: {},
      isRegistering: false,
      registerStatus: {
        type: '',
        message: ''
      }
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      
      if (!this.form.name) {
        this.errors.name = 'Name is required';
      } else if (this.form.name.length < 3) {
        this.errors.name = 'Name must be at least 3 characters';
      }

      if (!this.form.email) {
        this.errors.email = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }

      if (!this.form.password) {
        this.errors.password = 'Password is required';
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters';
      }

      if (!this.form.role) {
        this.errors.role = 'Please select a role';
      }

      return Object.keys(this.errors).length === 0;
    },

    async register() {
      if (!this.validateForm()) {
        return;
      }

      this.isRegistering = true;
      this.registerStatus = { type: '', message: '' };

      try {
        // Use authService directly instead of Vuex for now
        await this.$store.dispatch('auth/register', this.form);

        this.registerStatus = {
          type: 'success',
          message: 'Account created successfully! Redirecting to login...'
        };

        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      } catch (err) {
        console.error('Registration error:', err);
        this.registerStatus = {
          type: 'danger',
          message: err.message || err.response?.data?.message || 'Registration failed. Please try again.'
        };
      } finally {
        this.isRegistering = false;
      }
    }
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}
</style>
