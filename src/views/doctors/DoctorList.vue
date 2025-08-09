<template>
  <div class="container py-4">
    <!-- Add/Edit Doctor Modal -->
    <div class="modal fade" id="doctorModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Edit Doctor' : 'Add New Doctor' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveDoctor">
              <div class="form-group mb-3">
                <label>Full Name*</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              
              <div class="form-group mb-3">
                <label>Email*</label>
                <input v-model="form.email" type="email" class="form-control" required />
              </div>
              
              <div v-if="!isEditMode" class="form-group mb-3">
                <label>Password*</label>
                <input v-model="form.password" type="password" class="form-control" :required="!isEditMode" />
              </div>
              
              <div class="form-group mb-3">
                <label>Phone Number</label>
                <input v-model="form.phone" type="tel" class="form-control" />
              </div>
              
            <div class="form-group mb-3">
  <label>Specialization*</label>
  <input 
    v-model="form.specialization" 
    type="text" 
    class="form-control" 
    placeholder="Enter specialization (e.g. Cardiology)"
    required
  />
</div>
              
              <div class="form-group mb-3">
                <label>Status</label>
                <select v-model="form.active" class="form-select">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>
              
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditMode ? 'Update' : 'Save' }}
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
            <p>Are you sure you want to delete this doctor?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Doctor List -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">All Doctors</h3>
      <button class="btn btn-primary" @click="openAddModal">
        <i class="fas fa-plus"></i> Add New Doctor
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
      <i class="fas fa-exclamation-triangle"></i> {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="loadDoctors">
        Retry
      </button>
    </div>

    <!-- Doctor Table -->
    <div v-else>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Status</th>
              <th style="min-width: 120px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doctor in doctors" :key="doctor.id">
              <td>{{ doctor.name }}</td>
              <td>{{ doctor.email }}</td>
              <td>{{ getSpecializationName(doctor.specialization_id) }}</td>
              <td>
                <span class="badge" :class="doctor.active ? 'bg-success' : 'bg-danger'">
                  {{ doctor.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="btn-group btn-group-sm" style="white-space: nowrap">
                  <button @click="openEditModal(doctor)" class="btn btn-outline-primary">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="openDeleteModal(doctor)" class="btn btn-outline-danger">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="doctors.length === 0">
              <td colspan="5" class="text-center py-4">
                <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
                <div>No doctors found</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import EnhancedDoctorService from '@/api/services/doctorService-enhanced'
import SpecializationService from '@/api/services/specializationService'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
  data() {
    return {
      loading: false,
      error: null,
      doctors: [],
      specializations: [],
     form: {
      id: null,
      name: '',
      email: '',
      password: '',
      phone: '',
      specialization: '', // Changed from specialization_id
      active: true
    },
      isEditMode: false,
      selectedDoctor: null,
      doctorModal: null,
      deleteModal: null
    }
  },
  async created() {
    await Promise.all([this.loadDoctors(), this.loadSpecializations()])
  },
  mounted() {
    this.doctorModal = new Modal(document.getElementById('doctorModal'))
    this.deleteModal = new Modal(document.getElementById('deleteModal'))
  },
  methods: {
    async loadDoctors() {
      this.loading = true
      this.error = null
      try {
        this.doctors = await EnhancedDoctorService.getDoctors()
      } catch (error) {
        this.error = error.message || 'Failed to load doctors'
        if (error.response?.status === 401) {
          setTimeout(() => this.$router.push('/login'), 2000)
        }
      } finally {
        this.loading = false
      }
    },

    async loadSpecializations() {
      try {
        this.specializations = await SpecializationService.getSpecializations()
      } catch (error) {
        console.error('Error loading specializations:', error)
        this.$toast.error('Failed to load specializations')
      }
    },

    getSpecializationName(id) {
      const spec = this.specializations.find(s => s.id === id)
      return spec ? spec.name : 'N/A'
    },

    openAddModal() {
      this.resetForm()
      this.isEditMode = false
      this.doctorModal.show()
    },

    openEditModal(doctor) {
      this.form = { 
        ...doctor,
        password: '' // Clear password field for edits
      }
      this.isEditMode = true
      this.doctorModal.show()
    },

    openDeleteModal(doctor) {
      this.selectedDoctor = doctor
      this.deleteModal.show()
    },

    resetForm() {
      this.form = {
        id: null,
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization_id: null,
        active: true
      }
    },

    async saveDoctor() {
    try {
    const doctorData = {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      specialization: this.form.specialization, // Changed from specialization_id
      active: this.form.active
    };
        // Only include password if it's being set/changed
        if (this.form.password) {
          doctorData.password = this.form.password
        }

        if (this.isEditMode) {
          await EnhancedDoctorService.updateDoctor(this.form.id, doctorData)
          this.$toast.success('Doctor updated successfully')
        } else {
          await EnhancedDoctorService.createDoctor(doctorData)
          this.$toast.success('Doctor created successfully')
        }

        this.doctorModal.hide()
        await this.loadDoctors()
      } catch (error) {
        console.error('Error saving doctor:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Operation failed'
        this.$toast.error(errorMsg)
      }
    },

    async confirmDelete() {
      try {
        await EnhancedDoctorService.deleteDoctor(this.selectedDoctor.id)
        this.$toast.success('Doctor deleted successfully')
        this.deleteModal.hide()
        await this.loadDoctors()
      } catch (error) {
        console.error('Error deleting doctor:', error)
        this.$toast.error(error.message || 'Delete failed')
      }
    }
  }
}
</script>

<style scoped>
.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.table-responsive {
  overflow-x: auto;
}

.badge {
  font-size: 0.875em;
  padding: 0.35em 0.65em;
}
</style>