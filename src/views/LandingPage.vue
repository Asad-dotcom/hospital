<template>
  <div class="landing-container">
    <div class="background-overlay"></div>
    <div class="container py-5 text-center content">
      <div class="header-section mb-5">
        <h1 class="display-4 mb-4">🏥 Hospital Management System</h1>
        <p class="lead mb-4">Comprehensive healthcare management solution</p>
      </div>
      
      <div class="card card-custom mx-auto">
        <div class="card-body">
          <h3 class="card-title mb-4">Get Started</h3>
          <p class="card-text mb-4">Please choose a registration option below:</p>
          <div class="d-flex justify-content-center gap-3 flex-wrap">
            <router-link to="/patient/register" class="btn btn-primary btn-lg">Register as Patient</router-link>
            <router-link to="/doctor/register" class="btn btn-success btn-lg">Register as Doctor</router-link>
            <router-link to="/admin/register" class="btn btn-warning btn-lg">Register as Admin</router-link>
          </div>
          
          <hr class="my-4">
          
          <div class="mt-4">
            <p class="mb-2">Already have an account?</p>
            <div class="d-flex justify-content-center gap-2 flex-wrap">
              <router-link to="/patient/login" class="btn btn-outline-primary btn-sm">Patient Login</router-link>
              <router-link to="/doctor/login" class="btn btn-outline-success btn-sm">Doctor Login</router-link>
              <router-link to="/admin/login" class="btn btn-outline-warning btn-sm">Admin Login</router-link>
              <router-link to="/pharmacist/login" class="btn btn-outline-info btn-sm">Pharmacist Login</router-link>
              <router-link to="/receptionist/login" class="btn btn-outline-secondary btn-sm">Receptionist Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style scoped>
.landing-container {
  position: relative;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/hospital-building-modern-parking-lot-59693686.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.2;
  z-index: -1;
}

.content {
  width: 100%;
  max-width: 800px;
  z-index: 1;
}

.header-section {
  background: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-custom {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  max-width: 600px;
}

.card-title {
  font-weight: 700;
  color: #333;
}

.btn-lg {
  margin: 5px;
  min-width: 180px;
}

.btn-sm {
  margin: 3px;
}

hr {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .header-section {
    padding: 1rem;
  }
  
  .btn-lg {
    min-width: 140px;
    font-size: 0.9rem;
  }
  
  .card-custom {
    margin: 0 15px;
  }
}
</style>
