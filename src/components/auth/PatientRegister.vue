<template>
  <div class="container mt-5">
    <h3>Patient Registration</h3>
    <form @submit.prevent="registerPatient">
      <div class="form-group">
        <label>Username</label>
        <input v-model="form.username" type="text" class="form-control" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" class="form-control" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="form.password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary mt-3">Register</button>
    </form>
    <router-link to="/patient/login" class="btn btn-link mt-3">Already have an account? Login</router-link>
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
    };
  },
  methods: {
    registerPatient() {
      const user = { ...this.form, role: 'patient' };
      this.$store.commit('auth/registerUser', user);
      alert('Patient registered successfully!');
      this.$router.push('/patient/login');
    },
  },
};
</script>
