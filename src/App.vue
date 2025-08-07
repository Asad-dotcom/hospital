<template>
  <div id="app">
    <!-- Sidebar -->
    <Sidebar 
      v-if="isAuthenticated" 
      :class="{ 'collapsed': isSidebarCollapsed }"
      @toggle="handleSidebarToggle"
    />

    <!-- Main Content Area -->
    <div :class="['main-content', { 'has-sidebar': isAuthenticated, 'collapsed': isSidebarCollapsed }]" >
      <!-- Navbar (only show when authenticated) -->
      <nav v-if="isAuthenticated" class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container-fluid">
          <button 
            v-if="isAuthenticated && !isMobile" 
            class="btn btn-outline-light btn-sm mr-3"
            @click="toggleSidebar"
            title="Toggle Sidebar"
          >
            <i class="fas fa-bars"></i>
          </button>
          <router-link class="navbar-brand" to="/">🏥 Hospital System</router-link>
          <div class="ml-auto d-flex align-items-center">
            <span class="text-white mr-3 d-none d-md-inline">
              Welcome, {{ userName }} ({{ userRole }})
            </span>
            <button
              class="btn btn-outline-light btn-sm"
              @click="handleLogout"
            >
              <i class="fas fa-sign-out-alt"></i>
              <span class="d-none d-md-inline ml-1">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Navbar for non-authenticated users -->
      <nav v-else class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container">
          <router-link class="navbar-brand" to="/">🏥 Hospital System</router-link>
          <div class="ml-auto">
            <router-link to="/login" class="btn btn-outline-light btn-sm mr-2">Login</router-link>
            <router-link to="/register" class="btn btn-light btn-sm">Register</router-link>
          </div>
        </div>
      </nav>

      <!-- Alerts or notifications -->
      <NotificationToast />

      <!-- Route View -->
      <div :class="['content-wrapper', { 'py-4': !isAuthenticated, 'p-4': isAuthenticated }]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import NotificationToast from "./components/common/NotificationToast.vue";
import Sidebar from "./components/layout/Sidebar.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    NotificationToast,
    Sidebar,
  },
  data() {
    return {
      isSidebarCollapsed: false,
      isMobile: false
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated", "currentUser"]),
    userRole() {
      return this.currentUser ? this.currentUser.role : '';
    },
    userName() {
      return this.currentUser ? this.currentUser.name || this.currentUser.username || this.currentUser.email : '';
    }
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    handleLogout() {
      this.logout();
      this.$router.push('/');
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed);
    },
    handleSidebarToggle(collapsed) {
      this.isSidebarCollapsed = collapsed;
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768;
    },
    loadCollapsedState() {
      const saved = localStorage.getItem('sidebarCollapsed');
      this.isSidebarCollapsed = saved === 'true';
    }
  },
  mounted() {
    this.checkScreenSize();
    this.loadCollapsedState();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  }
};
</script>

<style>
body {
  background-color: #f8f9fa;
  background-image: url('@/assets/hospital-building-modern-parking-lot-59693686.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  position: relative;
}

body::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 249, 250, 0.8);
  z-index: -1;
}

#app {
  min-height: 100vh;
}

.main-content {
  transition: margin-left 0.3s ease;
  min-height: 100vh;
}

.main-content.has-sidebar {
  margin-left: 250px;
}

.main-content.has-sidebar.collapsed {
  margin-left: 70px;
}

.content-wrapper {
  min-height: calc(100vh - 56px);
}

@media (max-width: 768px) {
  .main-content.has-sidebar {
    margin-left: 0;
  }
}
</style>
