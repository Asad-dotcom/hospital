<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="mb-0">Patient Management</h3>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="refreshData">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
        <router-link to="/patients/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add New Patient
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
            <select v-model="genderFilter" class="form-select" @change="handleFilter">
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
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

    <!-- Patient Table -->
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
                <th>Gender</th>
                <th @click="sortBy('active')" class="cursor-pointer">
                  Status 
                  <i :class="getSortIcon('active')" class="ms-1"></i>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(patient, index) in paginatedPatients" :key="patient.id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">
                      {{ patient.name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ patient.name }}</div>
                      <small class="text-muted">ID: {{ patient.id }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ patient.email }}</td>
                <td>{{ patient.phone || 'N/A' }}</td>
                <td>
                  <span class="badge bg-secondary">{{ patient.gender || 'N/A' }}</span>
                </td>
                <td>
                  <span 
                    class="badge"
                    :class="patient.active ? 'bg-success' : 'bg-danger'"
                  >
                    {{ patient.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      @click="viewPatient(patient.id)" 
                      class="btn btn-outline-info"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      @click="editPatient(patient.id)" 
                      class="btn btn-outline-primary"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="toggleStatus(patient)" 
                      class="btn btn-outline-warning"
                      :title="patient.active ? 'Deactivate' : 'Activate'"
                    >
                      <i :class="patient.active ? 'fas fa-ban' : 'fas fa-check'"></i>
                    </button>
                    <button 
                      @click="deletePatient(patient)" 
                      class="btn btn-outline-danger"
                      title="Delete"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPatients.length === 0">
                <td colspan="7" class="text-center py-4">
                  <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
                  <div>No patients found</div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'PatientListEnhanced',
  data() {
    return {
      loading: false,
      error: null,
      searchQuery: '',
      statusFilter: '',
      genderFilter: '',
      sortField: 'name',
      sortDirection: 'asc',
      currentPage: 1,
      pageSize: 10,
      showConfirmDialog: false,
      confirmDialog: {
        title: '',
        message: '',
        action: null,
        confirmButtonText: '',
        confirmButtonClass: ''
      }
    }
  },
  computed: {
    ...mapState('patients', ['list']),
    filteredPatients() {
      let patients = [...this.list]

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        patients = patients.filter(patient => 
          patient.name.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query)
        )
      }

      // Apply status filter
      if (this.statusFilter) {
        const isActive = this.statusFilter === 'active'
        patients = patients.filter(patient => patient.active === isActive)
      }

      // Apply gender filter
      if (this.genderFilter) {
        patients = patients.filter(patient => patient.gender === this.genderFilter)
      }

      // Apply sorting
      patients.sort((a, b) => {
        let aVal = a[this.sortField]
        let bVal = b[this.sortField]
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        if (this.sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })

      return patients
    },
    paginatedPatients() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredPatients.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredPatients.length / this.pageSize)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  async mounted() {
    await this.loadPatients()
  },
  methods: {
    ...mapActions('patients', [
      'fetchPatients',
      'addPatient',
      'updatePatient',
      'deletePatient',
      'togglePatientStatus',
      'savePatients'
    ]),
    async loadPatients() {
      this.loading = true
      this.error = null
      try {
        await this.fetchPatients()
      } catch (error) {
        // Handle authentication errors specifically
        if (error.message?.includes('Authentication') || error.message?.includes('permission')) {
          this.error = error.message
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.$router.push('/login')
          }, 3000)
        } else {
          this.error = 'Failed to load patients. Please try again.'
        }
        console.error('Error loading patients:', error)
      } finally {
        this.loading = false
      }
    },
    async refreshData() {
      await this.loadPatients()
    },
    viewPatient(id) {
      this.$router.push({ name: 'PatientDetails', params: { id } })
    },
    editPatient(id) {
      this.$router.push({ name: 'EditPatient', params: { id } })
    },
    async toggleStatus(patient) {
      try {
        await this.togglePatientStatus(patient.id)
        await this.savePatients()
        this.$toast.success(`Patient ${patient.active ? 'deactivated' : 'activated'} successfully`)
      } catch (error) {
        this.$toast.error('Failed to update patient status')
      }
    },
    deletePatient(patient) {
      this.showConfirmDialog = true
      this.confirmDialog = {
        title: 'Delete Patient',
        message: `Are you sure you want to delete ${patient.name}? This action cannot be undone.`,
        action: async () => {
          try {
            await this.deletePatient(patient.id)
            await this.savePatients()
            this.$toast.success('Patient deleted successfully')
            this.closeConfirmDialog()
          } catch (error) {
            this.$toast.error('Failed to delete patient')
            this.closeConfirmDialog()
          }
        },
        confirmButtonText: 'Delete',
        confirmButtonClass: 'btn-danger'
      }
    },
    handleSearch() {
      this.currentPage = 1
    },
    handleFilter() {
      this.currentPage = 1
    },
    clearFilters() {
      this.searchQuery = ''
      this.statusFilter = ''
      this.genderFilter = ''
      this.currentPage = 1
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
    },
    getSortIcon(field) {
      if (this.sortField !== field) return 'fas fa-sort'
      return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    closeConfirmDialog() {
      this.showConfirmDialog = false
      this.confirmDialog = {
        title: '',
        message: '',
        action: null,
        confirmButtonText: '',
        confirmButtonClass: ''
      }
    }
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

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

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
