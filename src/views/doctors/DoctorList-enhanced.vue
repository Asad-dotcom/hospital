<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">Doctor Management</h3>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="refreshData">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
        <router-link to="/doctors/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add New Doctor
        </router-link>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="Search by name or email..."
              @input="handleSearch"
            />
          </div>
          <div class="col-md-3">
            <select v-model="statusFilter" class="form-select" @change="handleFilter">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="specializationFilter" class="form-select" @change="handleFilter">
              <option value="">All Specializations</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="General">General</option>
            </select>
          </div>
          <div class="col-md-2">
            <button class="btn btn-secondary w-100" @click="clearFilters">
              <i class="fas fa-times"></i> Clear
            </button>
          </div>
        </div>
      </div>
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
      <button class="btn btn-sm btn-outline-danger ms-3" @click="refreshData">
        Retry
      </button>
    </div>

    <!-- Doctor Table -->
    <div v-else class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th width="50">#</th>
                <th @click="sortBy('name')" class="cursor-pointer">
                  Name 
                  <i :class="getSortIcon('name')" class="ms-1"></i>
                </th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th @click="sortBy('active')" class="cursor-pointer">
                  Status 
                  <i :class="getSortIcon('active')" class="ms-1"></i>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doctor, index) in paginatedDoctors" :key="doctor.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">
                      {{ doctor.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ doctor.name }}</div>
                      <small class="text-muted">ID: {{ doctor.id }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ doctor.email || 'N/A' }}</td>
                <td>{{ doctor.phone || 'N/A' }}</td>
                <td>
                  <span class="badge bg-info">{{ doctor.specialization || 'N/A' }}</span>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="doctor.active ? 'bg-success' : 'bg-danger'"
                  >
                    {{ doctor.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="viewDoctor(doctor.id)" 
                      class="btn btn-outline-info"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      @click="editDoctor(doctor.id)" 
                      class="btn btn-outline-primary"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="toggleStatus(doctor)" 
                      class="btn btn-outline-warning"
                      :title="doctor.active ? 'Deactivate' : 'Activate'"
                    >
                      <i :class="doctor.active ? 'fas fa-ban' : 'fas fa-check'"></i>
                    </button>
                    <button 
                      @click="deleteDoctor(doctor)" 
                      class="btn btn-outline-danger"
                      title="Delete"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredDoctors.length === 0">
                <td colspan="7" class="text-center py-4">
                  <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
                  <div>No doctors found</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="mt-3">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                <i class="fas fa-chevron-left"></i>
              </a>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page" 
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                <i class="fas fa-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <div v-if="showConfirmDialog" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ confirmDialog.title }}</h5>
            <button type="button" class="btn-close" @click="closeConfirmDialog"></button>
          </div>
          <div class="modal-body">
            <p>{{ confirmDialog.message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeConfirmDialog">
              Cancel
            </button>
            <button type="button" class="btn" :class="confirmDialog.confirmButtonClass" @click="confirmDialog.action">
              {{ confirmDialog.confirmButtonText }}
            </button>
              <button 
    @click="confirmDelete(doctor)" 
    class="btn btn-outline-danger"
    title="Delete"
  >
    <i class="fas fa-trash"></i>
  </button>

          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import EnhancedDoctorService from '@/api/services/doctorService-enhanced'
import { Modal } from 'bootstrap'

export default {
  // Your existing data, computed properties remain the same
  
  methods: {
    // ... other methods remain the same until the CRUD operations

    async loadDoctors() {
      this.loading = true
      this.error = null
      try {
        const doctors = await EnhancedDoctorService.getDoctors()
        this.$store.commit('doctors/SET_PATIENTS', doctors)
      } catch (error) {
        this.error = error.message || 'Failed to load doctors'
        if (error.message?.includes('Authentication')) {
          setTimeout(() => this.$router.push('/login'), 2000)
        }
      } finally {
        this.loading = false
      }
    },

    async toggleStatus(doctor) {
      try {
        await EnhancedDoctorService.updateDoctor(doctor.id, {
          active: !doctor.active
        })
        this.$store.commit('doctors/TOGGLE_PATIENT_STATUS', 
          this.list.findIndex(d => d.id === doctor.id))
        this.$toast.success(`Doctor ${doctor.active ? 'deactivated' : 'activated'} successfully`)
      } catch (error) {
        this.$toast.error(error.message || 'Failed to update status')
      }
    },

    confirmDelete(doctor) {
      this.showConfirmDialog = true
      this.confirmDialog = {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete Dr. ${doctor.name}?`,
        action: () => this.deleteDoctor(doctor.id),
        confirmButtonText: 'Delete',
        confirmButtonClass: 'btn-danger'
      }
    },

    async deleteDoctor(id) {
      try {
        await EnhancedDoctorService.deleteDoctor(id)
        this.$store.commit('doctors/DELETE_DOCTOR', 
          this.list.findIndex(d => d.id === id))
        this.$toast.success('Doctor deleted successfully')
        this.closeConfirmDialog()
      } catch (error) {
        this.$toast.error(error.message || 'Failed to delete doctor')
      }
    },

    // Add these new methods for the store mutations
    ...mapMutations('doctors', [
      'ADD_DOCTOR',
      'UPDATE_DOCTOR',
      'DELETE_DOCTOR',
      'TOGGLE_PATIENT_STATUS'
    ]),
  }
}
</script>