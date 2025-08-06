import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store'; // Vuex store

Vue.use(Router);

// Global route guard for authentication check
function requireAuth(to, from, next) {
  const token = localStorage.getItem('token');
  const user = store.state.auth.currentUser;
  
  if (token && user) {
    next();
  } 
  else {
    // Redirect to appropriate login page based on path
    if (to.path.startsWith('/dashboard/patient') || to.path.startsWith('/patients')) {
      next('/patient/login');
    } else if (to.path.startsWith('/dashboard/doctor') || to.path.startsWith('/appointments/calendar') || 
               to.path.startsWith('/appointments/approve') || to.path.startsWith('/billing/prescriptions')) {
      next('/doctor/login');
    } else if (to.path.startsWith('/dashboard/admin') || to.path.startsWith('/doctors') || 
               to.path.startsWith('/patients')) {
      next('/admin/login');
    } else if (to.path.startsWith('/inventory')) {
      next('/pharmacist/login');
    } else if (to.path.startsWith('/billing')) {
      next('/receptionist/login');
    } else {
      next('/');
    }
  }
}

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/register' },
    { path: '/login', name: 'UnifiedLogin', component: () => import('@/components/auth/UnifiedLogin.vue') },
    { path: '/register', name: 'UnifiedRegister', component: () => import('@/components/auth/UnifiedRegister.vue') },

    // ====== LEGACY AUTH ROUTES (for backward compatibility) ======
    { path: '/patient/register', redirect: '/register' },
    { path: '/doctor/register', redirect: '/register' },
    { path: '/admin/register', redirect: '/register' },
    { path: '/pharmacist/register', redirect: '/register' },
    { path: '/receptionist/register', redirect: '/register' },

    { path: '/patient/login', redirect: '/login' },
    { path: '/doctor/login', redirect: '/login' },
    { path: '/admin/login', redirect: '/login' },
    { path: '/pharmacist/login', redirect: '/login' },
    { path: '/receptionist/login', redirect: '/login' },

    // ====== DASHBOARDS ======
    { path: '/dashboard/patient', name: 'PatientDashboard', component: () => import('@/views/dashboard/PatientDashboard.vue'), beforeEnter: requireAuth },
    { path: '/dashboard/doctor', name: 'DoctorDashboard', component: () => import('@/views/dashboard/DoctorDashboard.vue'), beforeEnter: requireAuth },
    { path: '/dashboard/admin', name: 'AdminDashboard', component: () => import('@/views/dashboard/AdminDashboard.vue'), beforeEnter: requireAuth },
    { path: '/dashboard/pharmacist', name: 'PharmacistDashboard', component: () => import('@/views/dashboard/PharmacistDashboard.vue'), beforeEnter: requireAuth },
    { path: '/dashboard/receptionist', name: 'ReceptionistDashboard', component: () => import('@/views/dashboard/ReceptionistDashboard.vue'), beforeEnter: requireAuth },

    // ====== PATIENTS ======
    { path: '/patients', name: 'PatientList', component: () => import('@/views/patients/PatientList.vue'), beforeEnter: requireAuth },
    { path: '/patients/new', name: 'PatientForm', component: () => import('@/views/patients/PatientForm.vue'), beforeEnter: requireAuth },
    { path: '/patients/history', name: 'MedicalHistory', component: () => import('@/views/patients/MedicalHistory.vue'), beforeEnter: requireAuth },
    { path: '/patients/upload', name: 'DocumentUploader', component: () => import('@/views/patients/DocumentUploader.vue'), beforeEnter: requireAuth },

    // ====== DOCTORS ======
    { path: '/doctors', name: 'DoctorList', component: () => import('@/views/doctors/DoctorList.vue'), beforeEnter: requireAuth },
    { path: '/doctors/new', name: 'DoctorForm', component: () => import('@/views/doctors/DoctorForm.vue'), beforeEnter: requireAuth },
    { path: '/doctors/:id/edit', name: 'DoctorEdit', component: () => import('@/views/doctors/DoctorForm.vue'), beforeEnter: requireAuth },

    // ====== APPOINTMENTS ======
    { path: '/appointments/request', name: 'AppointmentRequest', component: () => import('@/views/appointments/AppointmentRequest.vue'), beforeEnter: requireAuth },
    { path: '/appointments/calendar', name: 'AppointmentCalendar', component: () => import('@/views/appointments/AppointmentCalendar.vue'), beforeEnter: requireAuth },
    { path: '/appointments/approve', name: 'AppointmentApproval', component: () => import('@/views/appointments/AppointmentApproval.vue'), beforeEnter: requireAuth },
    { path: '/appointments/status', name: 'AppointmentStatus', component: () => import('@/views/appointments/AppointmentStatus.vue'), beforeEnter: requireAuth },

    // ====== INVENTORY ======
    { path: '/inventory', name: 'MedicineList', component: () => import('@/views/inventory/MedicineList.vue'), beforeEnter: requireAuth },
    { path: '/inventory/new', name: 'MedicineForm', component: () => import('@/views/inventory/MedicineForm.vue'), beforeEnter: requireAuth },
    { path: '/inventory/:id/edit', name: 'MedicineEdit', component: () => import('@/views/inventory/MedicineForm.vue'), beforeEnter: requireAuth },
    { path: '/inventory/alerts', name: 'StockAlerts', component: () => import('@/views/inventory/StockAlerts.vue'), beforeEnter: requireAuth },
    { path: '/inventory/export', name: 'InventoryExport', component: () => import('@/views/inventory/InventoryExport.vue'), beforeEnter: requireAuth },

    // ====== BILLING & PRESCRIPTIONS ======
    { path: '/billing/new', name: 'BillingForm', component: () => import('@/views/billing/BillingForm.vue'), beforeEnter: requireAuth },
    { path: '/billing/history', name: 'BillingHistory', component: () => import('@/views/billing/BillingHistory.vue'), beforeEnter: requireAuth },
    { path: '/billing/prescriptions', name: 'PrescriptionList', component: () => import('@/views/billing/PrescriptionList.vue'), beforeEnter: requireAuth },
    { path: '/billing/prescriptions/new', name: 'PrescriptionForm', component: () => import('@/views/billing/PrescriptionForm.vue'), beforeEnter: requireAuth },
    { path: '/billing/prescriptions/:id/edit', name: 'PrescriptionEdit', component: () => import('@/views/billing/PrescriptionForm.vue'), beforeEnter: requireAuth },

    // ====== 404 NOT FOUND ======
    { path: '*', name: 'NotFound', component: () => import('@/views/NotFound.vue') }
  ]
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const user = store.state.auth.currentUser;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/', 
    '/login', '/register',
    '/patient/login', '/doctor/login', '/admin/login', '/pharmacist/login', '/receptionist/login',
    '/patient/register', '/doctor/register', '/admin/register', '/pharmacist/register', '/receptionist/register'
  ];
  
  const isPublicRoute = publicRoutes.includes(to.path);
  
  // If trying to access a protected route without authentication
  if (!isPublicRoute) {
    if (!token || !user) {
      // Redirect to unified login page
      next('/login');
      return;
    }
  }
  
  // If user is logged in and trying to access login/register pages, redirect to their dashboard
  if (token && user && (to.path.includes('/login') || to.path.includes('/register'))) {
    // Prevent redirect loop by checking if we're already on the target dashboard
    const targetDashboard = `/dashboard/${user.role}`;
    if (to.path === targetDashboard) {
      next();
      return;
    }
    
    next(targetDashboard);
    return;
  }
  
  next();
});

export default router;
