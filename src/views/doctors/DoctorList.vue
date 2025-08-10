<template>
  <div class="container py-4">
    <!-- Header + Add Doctor Button -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Doctors</h4>
      <button class="btn btn-primary" @click="openAddModal">Add Doctor</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center my-3">
      Loading doctors...
    </div>

    <!-- Error State -->
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <!-- Doctor List -->
    <div v-if="!loading && doctors.length > 0" class="table-responsive mb-4">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(doctor, index) in doctors" :key="doctor.id">
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="doctor.profile_picture_url || 'default-avatar.png'" width="40" height="40" class="rounded-circle" />
            </td>
            <td>{{ doctor.name }}</td>
            <td>{{ doctor.email }}</td>
            <td>{{ doctor.specialization?.name || '-' }}</td>
            <td>
              <span v-if="doctor.availability?.mon">Mon: {{ doctor.availability.mon[0].start }} - {{ doctor.availability.mon[0].end }}</span><br>
              <span v-if="doctor.availability?.tue">Tue: {{ doctor.availability.tue[0].start }} - {{ doctor.availability.tue[0].end }}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="openEditModal(doctor)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="openDeleteModal(doctor)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- No Doctors -->
    <div v-else-if="!loading && doctors.length === 0" class="alert alert-info">
      No doctors found.
    </div>

    <!-- Modal for Add/Edit Doctor -->
    <div class="modal fade" id="doctorModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Edit Doctor' : 'Add New Doctor' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveDoctor" enctype="multipart/form-data">
              <!-- Name Field -->
              <div class="form-group mb-3">
                <label>Full Name*</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>

              <!-- Email Field -->
              <div class="form-group mb-3">
                <label>Email*</label>
                <input v-model="form.email" type="email" class="form-control" required />
              </div>

              <!-- Password Fields -->
              <div v-if="!isEditMode" class="form-group mb-3">
                <label>Password*</label>
                <input v-model="form.password" type="password" class="form-control" required />
              </div>

              <div v-if="!isEditMode" class="form-group mb-3">
                <label>Confirm Password*</label>
                <input v-model="form.password_confirmation" type="password" class="form-control" required />
              </div>

              <!-- Specialization Field -->
              <div class="form-group mb-3">
                <label>Specialization*</label>
                <select v-model="form.specialization_id" class="form-select" required>
                  <option value="" disabled>Select Specialization</option>
                  <option v-for="spec in specializations" :key="spec.id" :value="spec.id">
                    {{ spec.name }}
                  </option>
                </select>
              </div>

              <!-- Profile Picture Field -->
              <div class="form-group mb-3">
                <label>Profile Picture{{ isEditMode ? '' : '*' }}</label>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileUpload"
                  class="form-control"
                  accept="image/*"
                  :required="!isEditMode"
                />
                <small class="text-muted">Accepted formats: JPG, PNG, JPEG (Max 2MB)</small>
                <div v-if="previewImage" class="mt-2">
                  <img :src="previewImage" width="100" class="img-thumbnail" />
                </div>
              </div>

              <!-- Availability Fields -->
              <div class="form-group mb-3">
                <label>Monday Availability</label>
                <div class="row g-2">
                  <div class="col">
                    <input v-model="form.availability.mon[0].start" type="time" class="form-control" />
                  </div>
                  <div class="col">
                    <input v-model="form.availability.mon[0].end" type="time" class="form-control" />
                  </div>
                </div>
              </div>

              <div class="form-group mb-3">
                <label>Tuesday Availability</label>
                <div class="row g-2">
                  <div class="col">
                    <input v-model="form.availability.tue[0].start" type="time" class="form-control" />
                  </div>
                  <div class="col">
                    <input v-model="form.availability.tue[0].end" type="time" class="form-control" />
                  </div>
                </div>
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
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <p>Are you sure you want to delete {{ selectedDoctor?.name }}?</p>
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EnhancedDoctorService from '@/api/services/doctorService-enhanced'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default {
  data() {
    return {
      loading: false,
      error: null,
      doctors: [],
      specializations: [
        { id: 1, name: 'Cardiology' },
        { id: 2, name: 'Neurology' },
        { id: 3, name: 'Pediatrics' }
      ],
      previewImage: null,
      form: {
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        specialization_id: '',
        profile_picture: null,
        active: true,
        availability: {
          mon: [{ start: '09:00', end: '12:00' }],
          tue: [{ start: '14:00', end: '16:00' }]
        }
      },
      isEditMode: false,
      selectedDoctor: null,
      doctorModal: null,
      deleteModal: null
    }
  },
  async created() {
    await this.loadDoctors()
    // Uncomment if you have an API endpoint for specializations
    // await this.loadSpecializations()
  },
  mounted() {
    this.doctorModal = new Modal(document.getElementById('doctorModal'))
    this.deleteModal = new Modal(document.getElementById('deleteModal'))
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        this.$toast.error('Only JPG, PNG images are allowed')
        this.$refs.fileInput.value = ''
        return
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        this.$toast.error('Image size should be less than 2MB')
        this.$refs.fileInput.value = ''
        return
      }

      this.form.profile_picture = file

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewImage = e.target.result
      }
      reader.readAsDataURL(file)
    },

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

    /* Uncomment if you have an API endpoint for specializations
    async loadSpecializations() {
      try {
        this.specializations = await EnhancedDoctorService.getSpecializations()
      } catch (error) {
        this.$toast.error('Failed to load specializations')
      }
    },
    */

    openAddModal() {
      this.resetForm()
      this.isEditMode = false
      this.doctorModal.show()
    },

    openEditModal(doctor) {
      this.form = {
        ...doctor,
        password: '',
        password_confirmation: '',
        profile_picture: null,
        specialization_id: doctor.specialization?.id || '',
        availability: doctor.availability || {
          mon: [{ start: '09:00', end: '12:00' }],
          tue: [{ start: '14:00', end: '16:00' }]
        }
      }
      this.previewImage = doctor.profile_picture_url || null
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
        password_confirmation: '',
        specialization_id: '',
        profile_picture: null,
        active: true,
        availability: {
          mon: [{ start: '09:00', end: '12:00' }],
          tue: [{ start: '14:00', end: '16:00' }]
        }
      }
      this.previewImage = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },

    async saveDoctor() {
  try {
    // Frontend validation
    if (!this.isEditMode && this.form.password !== this.form.password_confirmation) {
      this.$toast.error('Password and confirmation do not match');
      return;
    }

    if (!this.form.specialization_id) {
      this.$toast.error('Please select a specialization');
      return;
    }

    // For new doctors, profile picture is required
    if (!this.isEditMode && !this.form.profile_picture) {
      this.$toast.error('Profile picture is required');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    
    // Append all basic fields
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('specialization_id', this.form.specialization_id);
    formData.append('active', this.form.active.toString());

    // Append password fields if they exist
    if (this.form.password) {
      formData.append('password', this.form.password);
      formData.append('password_confirmation', this.form.password_confirmation);
    }

    // Append profile picture if it exists
    if (this.form.profile_picture) {
      // Verify the file is actually an image
      if (!this.form.profile_picture.type.match('image.*')) {
        this.$toast.error('Profile picture must be an image (JPG, PNG, JPEG)');
        return;
      }
      formData.append('profile_picture', this.form.profile_picture, this.form.profile_picture.name);
    }

    // Append availability
    formData.append('availability[mon][0][start]', this.form.availability.mon[0].start);
    formData.append('availability[mon][0][end]', this.form.availability.mon[0].end);
    formData.append('availability[tue][0][start]', this.form.availability.tue[0].start);
    formData.append('availability[tue][0][end]', this.form.availability.tue[0].end);

    // Make API call
    let response;
    if (this.isEditMode) {
      response = await EnhancedDoctorService.updateDoctor(this.form.id, formData);
      this.$toast.success('Doctor updated successfully');
    } else {
      response = await EnhancedDoctorService.createDoctor(formData);
      this.$toast.success('Doctor created successfully');
    }

    // Log the response for debugging
    console.log('API Response:', response);

    this.doctorModal.hide();
    await this.loadDoctors();
  } catch (error) {
    console.error('Error saving doctor:', error);
    
    if (error.response?.data?.errors) {
      // Show all validation errors
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        messages.forEach(message => this.$toast.error(`${field}: ${message}`));
      });
    } else {
      const errorMsg = error.response?.data?.message || error.message || 'Operation failed';
      this.$toast.error(errorMsg);
    }
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
.table-responsive {
  overflow-x: auto;
}

.img-thumbnail {
  max-height: 100px;
  object-fit: cover;
}

.rounded-circle {
  object-fit: cover;
}
</style>