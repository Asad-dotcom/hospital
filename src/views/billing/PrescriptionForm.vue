<template>
  <div class="container py-4">
    <h3>Create Prescription</h3>

    <div v-if="submitStatus.message" :class="`alert alert-${submitStatus.type} mt-3`">
      {{ submitStatus.message }}
    </div>

    <form @submit.prevent="submitPrescription">
      <div class="form-group mb-3">
        <label>Patient Name</label>
        <input 
          v-model="form.patient" 
          class="form-control" 
          :class="{ 'is-invalid': errors.patient }"
          required 
        />
        <div v-if="errors.patient" class="invalid-feedback">
          {{ errors.patient }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Appointment ID</label>
        <input 
          v-model="form.appointmentId" 
          class="form-control" 
          :class="{ 'is-invalid': errors.appointmentId }"
          required 
        />
        <div v-if="errors.appointmentId" class="invalid-feedback">
          {{ errors.appointmentId }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Prescribed Medicines</label>
        <div class="mb-2" v-for="(medicine, index) in medicinesList" :key="index">
          <div class="row g-2">
            <div class="col-md-4">
              <input 
                v-model="medicine.name" 
                type="text" 
                class="form-control" 
                placeholder="Medicine name"
                :class="{ 'is-invalid': medicine.errors && medicine.errors.name }"
              />
              <div v-if="medicine.errors && medicine.errors.name" class="invalid-feedback">
                {{ medicine.errors.name }}
              </div>
            </div>
            <div class="col-md-2">
              <input 
                v-model="medicine.dosage" 
                type="text" 
                class="form-control" 
                placeholder="Dosage"
                :class="{ 'is-invalid': medicine.errors && medicine.errors.dosage }"
              />
              <div v-if="medicine.errors && medicine.errors.dosage" class="invalid-feedback">
                {{ medicine.errors.dosage }}
              </div>
            </div>
            <div class="col-md-2">
              <input 
                v-model="medicine.frequency" 
                type="text" 
                class="form-control" 
                placeholder="Frequency"
                :class="{ 'is-invalid': medicine.errors && medicine.errors.frequency }"
              />
              <div v-if="medicine.errors && medicine.errors.frequency" class="invalid-feedback">
                {{ medicine.errors.frequency }}
              </div>
            </div>
            <div class="col-md-2">
              <input 
                v-model="medicine.duration" 
                type="text" 
                class="form-control" 
                placeholder="Duration"
                :class="{ 'is-invalid': medicine.errors && medicine.errors.duration }"
              />
              <div v-if="medicine.errors && medicine.errors.duration" class="invalid-feedback">
                {{ medicine.errors.duration }}
              </div>
            </div>
            <div class="col-md-2">
              <button 
                type="button" 
                class="btn btn-danger" 
                @click="removeMedicine(index)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <button 
          type="button" 
          class="btn btn-secondary btn-sm mt-2" 
          @click="addMedicine"
        >
          Add Medicine
        </button>
        <div v-if="errors.medicines" class="text-danger mt-1">
          {{ errors.medicines }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Doctor Name</label>
        <input 
          v-model="form.doctor" 
          class="form-control" 
          :class="{ 'is-invalid': errors.doctor }"
          required 
        />
        <div v-if="errors.doctor" class="invalid-feedback">
          {{ errors.doctor }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label>Additional Notes</label>
        <textarea
          v-model="form.notes"
          class="form-control"
          placeholder="Additional instructions or notes"
          rows="3"
        ></textarea>
      </div>

      <button 
        type="submit" 
        class="btn btn-primary" 
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
        {{ isSubmitting ? 'Saving...' : 'Save Prescription' }}
      </button>
      <button 
        type="button" 
        class="btn btn-secondary ms-2" 
        @click="resetForm"
      >
        Reset
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        patient: '',
        appointmentId: '',
        medicines: [],
        doctor: '',
        date: new Date().toLocaleDateString(),
        notes: '',
      },
      medicinesList: [
        { name: '', dosage: '', frequency: '', duration: '', errors: {} }
      ],
      errors: {},
      isSubmitting: false,
      submitStatus: {
        type: '',
        message: ''
      }
    };
  },
  methods: {
    addMedicine() {
      this.medicinesList.push({ 
        name: '', 
        dosage: '', 
        frequency: '', 
        duration: '', 
        errors: {} 
      });
    },
    removeMedicine(index) {
      if (this.medicinesList.length > 1) {
        this.medicinesList.splice(index, 1);
      } else {
        // Reset the first medicine if it's the only one
        this.medicinesList[0] = { 
          name: '', 
          dosage: '', 
          frequency: '', 
          duration: '', 
          errors: {} 
        };
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;
      
      // Validate patient name
      if (!this.form.patient) {
        this.errors.patient = 'Patient name is required';
        isValid = false;
      }
      
      // Validate appointment ID
      if (!this.form.appointmentId) {
        this.errors.appointmentId = 'Appointment ID is required';
        isValid = false;
      }
      
      // Validate doctor name
      if (!this.form.doctor) {
        this.errors.doctor = 'Doctor name is required';
        isValid = false;
      }
      
      // Validate medicines list
      if (this.medicinesList.length === 0 || 
          (this.medicinesList.length === 1 && !this.medicinesList[0].name)) {
        this.errors.medicines = 'At least one medicine is required';
        isValid = false;
      } else {
        // Validate each medicine entry
        let hasMedicineErrors = false;
        this.medicinesList.forEach((medicine) => {
          medicine.errors = {};
          
          if (!medicine.name) {
            medicine.errors.name = 'Medicine name is required';
            hasMedicineErrors = true;
          }
          
          if (!medicine.dosage) {
            medicine.errors.dosage = 'Dosage is required';
            hasMedicineErrors = true;
          }
          
          if (!medicine.frequency) {
            medicine.errors.frequency = 'Frequency is required';
            hasMedicineErrors = true;
          }
          
          if (!medicine.duration) {
            medicine.errors.duration = 'Duration is required';
            hasMedicineErrors = true;
          }
        });
        
        if (hasMedicineErrors) {
          isValid = false;
        }
      }
      
      return isValid;
    },
    formatMedicines() {
      return this.medicinesList.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration
      }));
    },
    submitPrescription() {
      if (!this.validateForm()) {
        return;
      }
      
      this.isSubmitting = true;
      this.submitStatus = { type: '', message: '' };
      
      try {
        // Format medicines before submitting
        const prescriptionData = {
          ...this.form,
          medicines: this.formatMedicines()
        };
        
        // Simulate API call delay
        setTimeout(() => {
          this.$store.commit('billing/ADD_PRESCRIPTION', prescriptionData);
          
          // Show success message
          this.submitStatus = {
            type: 'success',
            message: 'Prescription saved successfully!'
          };
          
          // Redirect after a short delay
          setTimeout(() => {
            this.$router.push('/billing/prescriptions');
          }, 1500);
        }, 500);
      } catch (error) {
        // Handle submission error
        this.submitStatus = {
          type: 'danger',
          message: 'Failed to save prescription. Please try again.'
        };
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.form = {
        patient: '',
        appointmentId: '',
        medicines: [],
        doctor: '',
        date: new Date().toLocaleDateString(),
        notes: '',
      };
      this.medicinesList = [
        { name: '', dosage: '', frequency: '', duration: '', errors: {} }
      ];
      this.errors = {};
      this.submitStatus = { type: '', message: '' };
    }
  },
};
</script>
