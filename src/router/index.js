import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // Root Redirect
    { path: '/', redirect: '/register' },

    // Auth Routes
    { path: '/login', name: 'UnifiedLogin', component: () => import('@/components/auth/UnifiedLogin.vue') },
    { path: '/register', name: 'UnifiedRegister', component: () => import('@/components/auth/UnifiedRegister.vue') },

    // Legacy Auth Redirects
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

    // Dashboards
    { path: '/dashboard/patient', name: 'PatientDashboard', component: () => import('@/views/dashboard/PatientDashboard.vue') },
    { path: '/dashboard/doctor', name: 'DoctorDashboard', component: () => import('@/views/dashboard/DoctorDashboard.vue') },
    { path: '/dashboard/admin', name: 'AdminDashboard', component: () => import('@/views/dashboard/AdminDashboard.vue') },
    { path: '/dashboard/pharmacist', name: 'PharmacistDashboard', component: () => import('@/views/dashboard/PharmacistDashboard.vue') },
    { path: '/dashboard/receptionist', name: 'ReceptionistDashboard', component: () => import('@/views/dashboard/ReceptionistDashboard.vue') },

    // Patients
    { path: '/patients', name: 'PatientList', component: () => import('@/views/patients/PatientList.vue') },
    { path: '/patients/new', name: 'PatientForm', component: () => import('@/views/patients/PatientForm.vue') },
    { path: '/patients/history', name: 'MedicalHistory', component: () => import('@/views/patients/MedicalHistory.vue') },
    { path: '/patients/upload', name: 'DocumentUploader', component: () => import('@/views/patients/DocumentUploader.vue') },

    // Doctors
    { path: '/doctors', name: 'DoctorList', component: () => import('@/views/doctors/DoctorList.vue') },
    { path: '/doctors/new', name: 'DoctorForm', component: () => import('@/views/doctors/DoctorForm.vue') },
    { path: '/doctors/:id/edit', name: 'DoctorEdit', component: () => import('@/views/doctors/DoctorForm.vue') },

    // Appointments
    { path: '/appointments/request', name: 'AppointmentRequest', component: () => import('@/views/appointments/AppointmentRequest.vue') },
    { path: '/appointments/calendar', name: 'AppointmentCalendar', component: () => import('@/views/appointments/AppointmentCalendar.vue') },
    { path: '/appointments/approve', name: 'AppointmentApproval', component: () => import('@/views/appointments/AppointmentApproval.vue') },
    { path: '/appointments/status', name: 'AppointmentStatus', component: () => import('@/views/appointments/AppointmentStatus.vue') },

    // Inventory
    { path: '/inventory', name: 'MedicineList', component: () => import('@/views/inventory/MedicineList.vue') },
    { path: '/inventory/new', name: 'MedicineForm', component: () => import('@/views/inventory/MedicineForm.vue') },
    { path: '/inventory/:id/edit', name: 'MedicineEdit', component: () => import('@/views/inventory/MedicineForm.vue') },
    { path: '/inventory/alerts', name: 'StockAlerts', component: () => import('@/views/inventory/StockAlerts.vue') },
    { path: '/inventory/export', name: 'InventoryExport', component: () => import('@/views/inventory/InventoryExport.vue') },

    // Billing & Prescriptions
    { path: '/billing/new', name: 'BillingForm', component: () => import('@/views/billing/BillingForm.vue') },
    { path: '/billing/history', name: 'BillingHistory', component: () => import('@/views/billing/BillingHistory.vue') },
    { path: '/billing/prescriptions', name: 'PrescriptionList', component: () => import('@/views/billing/PrescriptionList.vue') },
    { path: '/billing/prescriptions/new', name: 'PrescriptionForm', component: () => import('@/views/billing/PrescriptionForm.vue') },
    { path: '/billing/prescriptions/:id/edit', name: 'PrescriptionEdit', component: () => import('@/views/billing/PrescriptionForm.vue') },

    // 404 - Keep at the end
    { path: '*', name: 'NotFound', component: () => import('@/views/NotFound.vue') }
  ]
});