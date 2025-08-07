<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h4 class="mb-0">
              {{ isEditMode ? 'Edit Patient' : 'Register New Patient' }}
            </h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="savePatient" class="needs-validation" novalidate>
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i> {{ error }}
              </div>

              <!-- Patient Form Fields -->
              <div class="row">
                <!-- Name -->
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label">Full Name *</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    required
                    maxlength="100"
                  />
                  <div v-if="errors.name" class="invalid-feedback">
                    {{ errors.name }}
                  </div>
                </div>

                <!-- Email -->
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    required
                    maxlength="100"
                  />
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Phone -->
                <div class="col-md-6 mb-3">
                  <label for="phone" class="form-label">Phone</label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-control"
                    :class="{ 'is-invalid': errors.phone }"
                    maxlength="20"
                  />
                  <div v-if="errors.phone" class="invalid-feedback">
                    {{ errors.phone }}
                  </div>
                </div>

                <!-- Gender -->
                <div class="col-md-6 mb-3">
                  <label for="gender" class="form-label">Gender</label>
                  <select
                    id="gender"
                    v-model="form.gender"
                    class="form-select"
                    :class="{ 'is-invalid': errors.gender }"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div v-if="errors.gender" class="invalid-feedback">
                    {{ errors.gender }}
                  </div>
                </div>

                <!-- Date of Birth -->
                <div class="col-md-6 mb-3">
                  <label for="dateOfBirth" class="form-label">Date of Birth</label>
                  <input
                    id="dateOfBirth"
                    v-model="form.dateOfBirth"
                    type="date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.dateOfBirth }"
                  />
                  <div v-if="errors.dateOfBirth" class="invalid-feedback">
                    {{ errors.dateOfBirth }}
                  </div>
                </div>

                <!-- Address -->
                <div class="col-md-6 mb-3">
                  <label for="address" class="form-label">Address</label>
                  <input
                    id="address"
                    v-model="form.address"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.address }"
                    maxlength="200"
                  />
                  <div v-if="errors.address" class="invalid-feedback">
                    {{ errors.address }}
                  </div>
                </div>

                <!-- Emergency Contact -->
                <div class="col-md-6 mb-3">
                  <label for="emergencyContact" class="form-label">Emergency Contact</label>
                  <input
                    id="emergencyContact"
                    v-model="form.emergencyContact"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.emergencyContact }"
                    maxlength="100"
                  />
                  <div v-if="errors.emergencyContact" class="invalid-feedback">
                    {{ errors.emergencyContact }}
                  </div>
                </div>

                <!-- Blood Group -->
                <div class="col-md-6 mb-3">
                  <label for="bloodGroup" class="form-label">Blood Group</label>
                  <select
                    id="bloodGroup"
                    v-model="form.bloodGroup"
                    class="form-select"
                    :class="{ 'is-invalid': errors.bloodGroup }"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <div v-if="errors.bloodGroup" class="invalid-feedback">
                    {{ errors.bloodGroup }}
                  </div>
                </div>

                <!-- Allergies -->
                <div class="col-md-6 mb-3">
                  <label for="allergies" class="form-label">Allergies</label>
                  <textarea
                    id="allergies"
                    v-model="form.allergies"
                    class="form-control"
                    rows="2"
                    maxlength="500"
                  ></textarea>
                </div>

                <!-- Medical History -->
                <div class="col-md-12 mb-3">
                  <label for="medicalHistory" class="form-label">Medical History</label>
                  <textarea
                    id="medicalHistory"
                    v-model="form.medicalHistory"
                    class="form-control"
                    rows="3"
                    maxlength="1000"
                  ></textarea>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="d-flex justify-content-between">
                <router-link to="/patients" class="btn btn-secondary">
                  <i class="fas fa-arrow-left"></i> Back to List
                </router-link>
                <div>
                  <button 
                    type="submit" 
                    class="btn btn-success"
                    :disabled="loading"
                  >
                    <i class="fas fa-save"></i>
                    {{ isEditMode ? 'Update Patient' : 'Register Patient' }}
                  </button>
                  <button 
                    v-if="isEditMode" 
                    type="button"
                    class="btn btn-outline-danger ms-2"
                    @click="deletePatient"
                    :disabled="loading"
                  >
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PatientFormEnhanced',
  data() {
    return {
      loading: false,
      error: null,
      form: {
        name: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
        bloodGroup: '',
        allergies: '',
        medicalHistory: '',
        active: true
      },
      errors: {}
    }
  },
  computed: {
    ...mapGetters('patients', ['getPatientById']),
    isEditMode() {
      return this.$route.name === 'EditPatient'
    },
    patientId() {
      return this.$route.params.id
    }
  },
  async mounted() {
    if (this.isEditMode) {
      await this.loadPatient()
    }
  },
  methods: {
    ...mapActions('patients', [
      'addPatient',
      'updatePatient',
      'deletePatient',
      'savePatients'
    ]),
    async loadPatient() {
      this.loading = true
      try {
        const patient = this.getPatientById(this.patientId)
        if (patient) {
          this.form = { ...patient }
        } else {
          this.error = 'Patient not found'
          setTimeout(() => {
            this.$router.push('/patients')
          }, 2000)
        }
      } catch (error) {
        this.error = 'Failed to load patient data'
      } finally {
        this.loading = false
      }
    },
    validateForm() {
      this.errors = {}

      // Name validation
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required'
      } else if (this.form.name.length < 2) {
        this.errors.name = 'Name must be at least 2 characters'
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required'
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address'
      }

      // Phone validation
      if (this.form.phone && !/^[0-9+\-\s()]+$/.test(this.form.phone)) {
        this.errors.phone = 'Please enter a valid phone number'
      }

      // Date of birth validation
      if (this.form.dateOfBirth) {
        const dob = new Date(this.form.dateOfBirth)
        const today = new Date()
        if (dob > today) {
          this.errors.dateOfBirth = 'Date of birth cannot be in the future'
        }
      }

      return Object.keys(this.errors).length === 0
    },
    async savePatient() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const patientData = {
          ...this.form,
          role: 'patient',
          updatedAt: new Date().toISOString()
        }

        if (this.isEditMode) {
          await this.updatePatient({ id: this.patientId, data: patientData })
          this.$toast.success('Patient updated successfully')
        } else {
          patientData.createdAt = new Date().toISOString()
          await this.addPatient(patientData)
          this.$toast.success('Patient registered successfully')
        }

        await this.savePatients()
        this.$router.push('/patients')
      } catch (error) {
        this.error = this.isEditMode 
          ? 'Failed to update patient' 
          : 'Failed to register patient'
      } finally {
        this.loading = false
      }
    },
    async deletePatient() {
      if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
        this.loading = true
        try {
          await this.deletePatient(this.patientId)
          await this.savePatients()
          this.$toast.success('Patient deleted successfully')
          this.$router.push('/patients')
        } catch (error) {
          this.error = 'Failed to delete patient'
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.invalid-feedback {
  display: block;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
