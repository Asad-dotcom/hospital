<template>
  <div class="container py-4">
    <!-- Header and Add Button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Patient Management</h3>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="fas fa-plus me-1"></i> Add Patient
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="fetchPatients">
        Retry
      </button>
    </div>

    <!-- Patient Table -->
    <div v-else>
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(patient, index) in patients" :key="patient.id">
              <td>{{ index + 1 }}</td>
              <td>{{ patient.name }}</td>
              <td>{{ patient.email }}</td>
              <td>{{ patient.phone || 'N/A' }}</td>
              <td>{{ patient.gender || 'N/A' }}</td>
              <td>
                <span class="badge" :class="patient.active ? 'bg-success' : 'bg-secondary'">
                  {{ patient.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button @click="openEditModal(patient)" class="btn btn-sm btn-primary me-2">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button @click="openDeleteModal(patient)" class="btn btn-sm btn-danger">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
            <tr v-if="patients.length === 0">
              <td colspan="7" class="text-center py-4">No patients found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Patient Modal -->
    <div class="modal fade" id="patientModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Edit Patient' : 'Add New Patient' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
         <div class="modal-body">
    <form @submit.prevent="submitForm">
      <div class="row">
        <!-- Personal Information -->
        <div class="col-md-6">
          <h5 class="mb-3">Personal Information</h5>
          
          <div class="mb-3">
            <label class="form-label">Full Name*</label>
            <input v-model="form.name" type="text" class="form-control" required>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Email*</label>
            <input v-model="form.email" type="email" class="form-control" required>
          </div>
          
          <!-- Password Fields (only for new patients) -->
          <div v-if="!isEditMode" class="mb-3">
            <label class="form-label">Password*</label>
            <input v-model="form.password" type="password" class="form-control" required>
          </div>
          
          <div v-if="!isEditMode" class="mb-3">
            <label class="form-label">Confirm Password*</label>
            <input v-model="form.password_confirmation" type="password" class="form-control" required>
            <small v-if="passwordMismatch" class="text-danger">Passwords do not match</small>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Date of Birth*</label>
            <input v-model="form.dob" type="date" class="form-control" required>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Gender*</label>
            <select v-model="form.gender" class="form-select" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div class="col-md-6">
          <h5 class="mb-3">Contact Information</h5>
          
          <div class="mb-3">
            <label class="form-label">Phone Number*</label>
            <input v-model="form.phone" type="tel" class="form-control" required>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Address*</label>
            <textarea v-model="form.address" class="form-control" rows="3" required></textarea>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Status</label>
            <select v-model="form.active" class="form-select">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-primary" :disabled="formLoading || passwordMismatch">
          {{ formLoading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ selectedPatient?.name }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="deleteLoading">
              {{ deleteLoading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import EnhancedPatientService from '@/api/services/patientService-enhanced'

export default {
   computed: {
    passwordMismatch() {
      if (this.isEditMode) return false
      return this.form.password && this.form.password_confirmation && 
             this.form.password !== this.form.password_confirmation
    },
    validGender() {
      return ['male', 'female', 'other'].includes(this.form.gender)
    }
  },
  data() {
    return {
      patients: [],
      loading: false,
      error: null,
      formLoading: false,
      deleteLoading: false,
      isEditMode: false,
      selectedPatient: null,
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '', 
        dob: '',
        gender: '',
        phone: '',
        address: '',
        active: true
      },
      patientModal: null,
      deleteModal: null
    }
  },
  async created() {
    await this.fetchPatients()
  },
  mounted() {
    this.patientModal = new Modal(document.getElementById('patientModal'))
    this.deleteModal = new Modal(document.getElementById('deleteModal'))
  },
  methods: {
    async fetchPatients() {
      this.loading = true
      this.error = null
      try {
        this.patients = await EnhancedPatientService.getPatients()
      } catch (error) {
        this.error = error.message || 'Failed to load patients'
      } finally {
        this.loading = false
      }
    },
    
    openAddModal() {
      this.resetForm()
      this.isEditMode = false
      this.patientModal.show()
    },
    
    openEditModal(patient) {
      this.selectedPatient = patient
      this.form = {
        name: patient.name,
        email: patient.email,
        password: '', // Password is optional for edits
        dob: patient.dob || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        address: patient.address || '',
        active: patient.active
      }
      this.isEditMode = true
      this.patientModal.show()
    },
    
    openDeleteModal(patient) {
      this.selectedPatient = patient
      this.deleteModal.show()
    },
    
    resetForm() {
      this.form = {
        name: '',
        email: '',
        password: '',
         password_confirmation: '',
        dob: '',
        gender: '',
        phone: '',
        address: '',
        active: true
      }
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Add file to form data if needed
        this.form.profile_picture = file
      }
    },
    
    async submitForm() {
      // Frontend validation
      if (this.passwordMismatch) {
        this.$toast.error('Password confirmation does not match')
        return
      }
      
      if (!this.validGender) {
        this.$toast.error('Please select a valid gender')
        return
      }
      
      this.formLoading = true
      try {
        // Prepare the data object
        const patientData = {
          name: this.form.name,
          email: this.form.email,
          dob: this.form.dob,
          gender: this.form.gender,
          phone: this.form.phone,
          address: this.form.address,
          active: this.form.active
        }
        
        // Only include password fields for new patients
        if (!this.isEditMode) {
          patientData.password = this.form.password
          patientData.password_confirmation = this.form.password_confirmation
        }
        
        if (this.isEditMode) {
          await EnhancedPatientService.updatePatient(this.selectedPatient.id, patientData)
          this.$toast.success('Patient updated successfully')
        } else {
          await EnhancedPatientService.createPatient(patientData)
          this.$toast.success('Patient created successfully')
        }
        
        this.patientModal.hide()
        await this.fetchPatients()
      } catch (error) {
        this.handleApiError(error)
      } finally {
        this.formLoading = false
      }
    },
    
    handleApiError(error) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        for (const field in errors) {
          errors[field].forEach(msg => this.$toast.error(`${field}: ${msg}`))
        }
      } else {
        this.$toast.error(error.message || 'Operation failed')
      }
    },
    
    async confirmDelete() {
      this.deleteLoading = true
      try {
        await EnhancedPatientService.deletePatient(this.selectedPatient.id)
        this.$toast.success('Patient deleted successfully')
        this.deleteModal.hide()
        await this.fetchPatients()
      } catch (error) {
        this.$toast.error(error.message || 'Delete failed')
      } finally {
        this.deleteLoading = false
      }
    }
  }
}
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

.badge {
  font-size: 0.875em;
  padding: 0.35em 0.65em;
}

.modal-lg {
  max-width: 800px;
}
</style>