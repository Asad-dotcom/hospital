<template>
  <div class="container mt-5">
    <h3>Admin Login</h3>
    
    <div v-if="loginStatus.message" :class="`alert alert-${loginStatus.type} mt-3`">
      {{ loginStatus.message }}
    </div>
    
    <form @submit.prevent="login">
      <div class="form-group">
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
      <div class="form-group">
        <label>Password</label>
        <input 
          v-model="form.password" 
          type="password" 
          class="form-control" 
          :class="{ 'is-invalid': errors.password }"
          required 
        />
        <div v-if="errors.password" class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>
      <button 
        type="submit" 
        class="btn btn-dark mt-3" 
        :disabled="isLoggingIn"
      >
        <span v-if="isLoggingIn" class="spinner-border spinner-border-sm me-2"></span>
        {{ isLoggingIn ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <div class="mt-3">
      <router-link to="/dashboard/admin" class="btn btn-link">Back to Dashboard</router-link>
      <router-link to="/admin/register" class="btn btn-link">Don't have an account? Register</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        role: 'admin'
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
      
      return Object.keys(this.errors).length === 0;
    },
    async login() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isLoggingIn = true;
      this.loginStatus = { type: '', message: '' };
      
      try {
        // Attempt to login using the Vuex store
        await this.$store.dispatch('auth/login', {
          email: this.form.email,
          password: this.form.password,
          role: this.form.role
        });
        
        // Show success message
        this.loginStatus = {
          type: 'success',
          message: 'Login successful! Redirecting...'
        };
        
        // Redirect after a short delay
        setTimeout(() => {
          this.$router.push('/dashboard/admin');
        }, 1500);
      } catch (err) {
        // Handle login error
        this.loginStatus = {
          type: 'danger',
          message: 'Invalid credentials for admin. Please try again.'
        };
      } finally {
        this.isLoggingIn = false;
      }
    },
  },
};
</script>
