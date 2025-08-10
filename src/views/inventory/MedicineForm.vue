<template>
  <div class="container py-4">
    <h3>{{ isEdit ? 'Edit' : 'Add' }} Medicine</h3>

    <form @submit.prevent="saveMedicine" class="mt-3">
      <div class="form-group mb-3">
        <label>Name</label>
        <input v-model="form.name" class="form-control" required />
      </div>

      <div class="form-group mb-3">
        <label>Quantity</label>
        <input v-model.number="form.quantity" type="number" class="form-control" required min="1" />
      </div>

      <div class="form-group mb-3">
        <label>Expiry Date</label>
        <input v-model="form.expiry" type="date" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-success me-2" :disabled="loading">
        {{ isEdit ? 'Update' : 'Add' }}
      </button>

      <router-link to="/inventory/medicine-list" class="btn btn-secondary">Cancel</router-link>
    </form>
  </div>
</template>

<script>
import medicineService from '@/api/services/medicineService'

export default {
  data() {
    return {
      form: {
        name: '',
        quantity: 0,
        expiry: ''
      },
      isEdit: false,
      loading: false,
      medicineId: null
    }
  },
  async mounted() {
    const id = this.$route.query.id
    if (id) {
      try {
        this.loading = true
        const response = await medicineService.getMedicine(id)
        this.form = response.data
        this.medicineId = id
        this.isEdit = true
      } catch (error) {
        console.error('Error fetching medicine:', error)
        this.$toast.error('Failed to load medicine details')
      } finally {
        this.loading = false
      }
    }
  },
  methods: {
    async saveMedicine() {
      this.loading = true
      try {
        if (this.isEdit) {
          await medicineService.updateMedicine(this.medicineId, this.form)
          this.$toast.success('Medicine updated successfully')
        } else {
          await medicineService.createMedicine(this.form)
          this.$toast.success('Medicine added successfully')
        }
        this.$router.push('/inventory/medicine-list')
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to save medicine')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>