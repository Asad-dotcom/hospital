<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">Login In</h3>

            <div v-if="loginStatus.message" :class="`alert alert-${loginStatus.type} mt-3`">
              {{ loginStatus.message }}
            </div>

            <form @submit.prevent="login">
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
                  placeholder="Enter your password"
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
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <div v-if="errors.role" class="invalid-feedback">
                  {{ errors.role }}
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="isLoggingIn">
                <span v-if="isLoggingIn" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoggingIn ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <div class="text-center mt-3">
              <p class="mb-2">
                <router-link to="/register" class="btn btn-link">Don't have an account? Sign Up</router-link>
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
  name: 'UnifiedLogin',
  data() {
    return {
      form: {
        email: '',
        password: '',
        role: ''
      },
      errors: {},
      isLoggingIn: false,
      loginStatus: {
        type: '',
        message: ''
      }
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

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
async login() {
  if (!this.validateForm()) return;

  // Always clear old session first
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  this.isLoggingIn = true;
  this.loginStatus = { type: '', message: '' };

  try {
    const { user } = await this.$store.dispatch('auth/login', this.form);

    if (!user?.role) throw new Error('No role found for user');

    this.loginStatus = {
      type: 'success',
      message: 'Login successful! Redirecting...'
    };

    setTimeout(() => {
      this.$router.push(`/dashboard/${user.role}`);
    }, 1000);
  } catch (err) {
    this.loginStatus = {
      type: 'danger',
      message: err.message || 'Login failed'
    };
  } finally {
    this.isLoggingIn = false;
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
