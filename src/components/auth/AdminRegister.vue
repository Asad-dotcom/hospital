<template>
  <div class="container mt-5">
    <h3>Admin Registration</h3>
    
    <div v-if="registerStatus.message" :class="`alert alert-${registerStatus.type} mt-3`">
      {{ registerStatus.message }}
    </div>
    
    <form @submit.prevent="registerAdmin">
      <div class="form-group">
        <label>Username</label>
        <input 
          v-model="form.username" 
          type="text" 
          class="form-control" 
          :class="{ 'is-invalid': errors.username }"
          required 
        />
        <div v-if="errors.username" class="invalid-feedback">
          {{ errors.username }}
        </div>
      </div>
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
        :disabled="isRegistering"
      >
        <span v-if="isRegistering" class="spinner-border spinner-border-sm me-2"></span>
        {{ isRegistering ? 'Registering...' : 'Register' }}
      </button>
    </form>
    <div class="mt-3">
      <router-link to="/admin/login" class="btn btn-link">Already have an account? Login</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
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
      
      if (!this.form.username) {
        this.errors.username = 'Username is required';
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
      
      return Object.keys(this.errors).length === 0;
    },
    registerAdmin() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isRegistering = true;
      this.registerStatus = { type: '', message: '' };
      
      try {
        const user = { ...this.form, role: 'admin' };
        this.$store.commit('auth/registerUser', user);
        
        // Show success message
        this.registerStatus = {
          type: 'success',
          message: 'Admin registered successfully! Redirecting to login...'
        };
        
        // Redirect after a short delay
        setTimeout(() => {
          this.$router.push('/admin/login');
        }, 1500);
      } catch (err) {
        // Handle registration error
        this.registerStatus = {
          type: 'danger',
          message: 'Registration failed. Please try again.'
        };
      } finally {
        this.isRegistering = false;
      }
    },
  },
};
</script>
