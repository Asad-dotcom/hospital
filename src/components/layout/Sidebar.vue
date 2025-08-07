<template>
  <div class="sidebar-container">
    <!-- Toggle button for mobile -->
    <button 
      v-if="isMobile" 
      class="sidebar-toggle"
      @click="toggleSidebar"
      :class="{ 'active': isSidebarOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Sidebar -->
    <aside 
      class="sidebar" 
      :class="{ 
        'collapsed': isCollapsed && !isMobile, 
        'open': isSidebarOpen && isMobile 
      }"
    >
      <!-- Logo/Brand -->
      <div class="sidebar-header">
        <div class="brand">
          <span class="brand-icon">🏥</span>
          <span v-if="!isCollapsed || isSidebarOpen" class="brand-text">Hospital System</span>
        </div>
      </div>

      <!-- User Profile Section -->
      <div class="user-profile" v-if="isAuthenticated">
        <div class="user-avatar">
          {{ userInitial }}
        </div>
        <div v-if="!isCollapsed || isSidebarOpen" class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li v-for="item in filteredMenuItems" :key="item.path" class="nav-item">
            <router-link 
              :to="item.path" 
              class="nav-link"
              :class="{ active: isActive(item.path) }"
              @click.native="handleNavClick"
            >
              <i :class="item.icon" class="nav-icon"></i>
              <span v-if="!isCollapsed || isSidebarOpen" class="nav-text">{{ item.label }}</span>
              <span v-if="item.badge && (!isCollapsed || isSidebarOpen)" class="nav-badge">{{ item.badge }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Footer Actions -->
      <div class="sidebar-footer">
        <button 
          v-if="!isMobile" 
          class="collapse-btn"
          @click="toggleCollapse"
          :title="isCollapsed ? 'Expand' : 'Collapse'"
        >
          <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
        
        <button 
          v-if="isAuthenticated" 
          class="logout-btn"
          @click="handleLogout"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!isCollapsed || isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div 
      v-if="isSidebarOpen && isMobile" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SideBar',
  data() {
    return {
      isCollapsed: false,
      isSidebarOpen: false,
      isMobile: false,
      menuItems: {
        patient: [
          { path: '/dashboard/patient', label: 'Dashboard', icon: 'fas fa-home' },
          { path: '/appointments/request', label: 'Book Appointment', icon: 'fas fa-calendar-plus' },
          { path: '/appointments/status', label: 'My Appointments', icon: 'fas fa-calendar-check' },
          { path: '/patients/history', label: 'Medical History', icon: 'fas fa-file-medical' },
          { path: '/patients/upload', label: 'Documents', icon: 'fas fa-file-upload' },
          { path: '/billing/history', label: 'Billing', icon: 'fas fa-file-invoice-dollar' }
        ],
        doctor: [
          { path: '/dashboard/doctor', label: 'Dashboard', icon: 'fas fa-home' },
          { path: '/appointments/calendar', label: 'Calendar', icon: 'fas fa-calendar-alt' },
          { path: '/appointments/approve', label: 'Pending Approvals', icon: 'fas fa-clock', badge: '3' },
          { path: '/billing/prescriptions', label: 'Prescriptions', icon: 'fas fa-prescription-bottle-alt' },
          { path: '/patients', label: 'Patients', icon: 'fas fa-user-injured' }
        ],
        admin: [
          { path: '/dashboard/admin', label: 'Dashboard', icon: 'fas fa-home' },
          { path: '/doctors', label: 'Doctors', icon: 'fas fa-user-md' },
          { path: '/patients', label: 'Patients', icon: 'fas fa-user-injured' },
          { path: '/appointments/calendar', label: 'Appointments', icon: 'fas fa-calendar-alt' },
          { path: '/inventory', label: 'Inventory', icon: 'fas fa-pills' },
          { path: '/billing/history', label: 'Billing', icon: 'fas fa-file-invoice-dollar' }
        ],
        pharmacist: [
          { path: '/dashboard/pharmacist', label: 'Dashboard', icon: 'fas fa-home' },
          { path: '/inventory', label: 'Inventory', icon: 'fas fa-pills' },
          { path: '/inventory/alerts', label: 'Stock Alerts', icon: 'fas fa-exclamation-triangle' },
          { path: '/billing/prescriptions', label: 'Prescriptions', icon: 'fas fa-prescription-bottle-alt' }
        ],
        receptionist: [
          { path: '/dashboard/receptionist', label: 'Dashboard', icon: 'fas fa-home' },
          { path: '/appointments/request', label: 'New Appointment', icon: 'fas fa-calendar-plus' },
          { path: '/appointments/calendar', label: 'Calendar', icon: 'fas fa-calendar-alt' },
          { path: '/patients', label: 'Patients', icon: 'fas fa-user-injured' },
          { path: '/billing/new', label: 'New Bill', icon: 'fas fa-file-invoice' },
          { path: '/billing/history', label: 'Billing History', icon: 'fas fa-history' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUser']),
    userRole() {
      return this.currentUser ? this.currentUser.role : ''
    },
    userName() {
      return this.currentUser ? this.currentUser.name || this.currentUser.username || this.currentUser.email : ''
    },
    userInitial() {
      return this.userName ? this.userName.charAt(0).toUpperCase() : '?'
    },
    filteredMenuItems() {
      return this.menuItems[this.userRole] || []
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      localStorage.setItem('sidebarCollapsed', this.isCollapsed)
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },
    closeSidebar() {
      this.isSidebarOpen = false
    },
    handleNavClick() {
      if (this.isMobile) {
        this.closeSidebar()
      }
    },
    handleLogout() {
      this.logout()
      this.$router.push('/')
      this.closeSidebar()
    },
    isActive(path) {
      return this.$route.path === path
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768
      if (!this.isMobile) {
        this.isSidebarOpen = false
      }
    },
    loadCollapsedState() {
      const saved = localStorage.getItem('sidebarCollapsed')
      this.isCollapsed = saved === 'true'
    }
  },
  mounted() {
    this.checkScreenSize()
    this.loadCollapsedState()
    window.addEventListener('resize', this.checkScreenSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize)
  }
}
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s ease;
  z-index: 1000;
  width: 250px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  font-size: 1.5rem;
}

.brand-text {
  font-weight: bold;
  font-size: 1.1rem;
  white-space: nowrap;
}

.user-profile {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info {
  text-align: center;
}

.user-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.8;
  text-transform: capitalize;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: white;
}

.nav-icon {
  width: 20px;
  margin-right: 0.75rem;
  text-align: center;
}

.nav-text {
  flex: 1;
  white-space: nowrap;
}

.nav-badge {
  background: #ff4757;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  margin-left: 0.5rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collapse-btn,
.logout-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.collapse-btn:hover,
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Mobile styles */
.sidebar-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #667eea;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: none;
  flex-direction: column;
  gap: 3px;
}

.sidebar-toggle span {
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

.sidebar-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.sidebar-toggle.active span:nth-child(2) {
  opacity: 0;
}

.sidebar-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

@media (max-width: 768px) {
  .sidebar-toggle {
    display: flex;
  }

  .sidebar {
    transform: translateX(-100%);
    width: 250px;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 250px;
  }
}
</style>
