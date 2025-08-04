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

      <button type="submit" class="btn btn-success me-2">
        {{ isEdit ? 'Update' : 'Add' }}
      </button>

      <router-link to="/inventory/medicine-list" class="btn btn-secondary">Cancel</router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        quantity: 0,
        expiry: '',
      },
      isEdit: false,
    };
  },
  mounted() {
    const editIndex = this.$route.query.edit;
    if (editIndex !== undefined) {
      const existing = this.$store.state.inventory.medicines[editIndex];
      if (existing) {
        this.form = { ...existing };
        this.formIndex = editIndex;
        this.isEdit = true;
      }
    }
  },
  methods: {
    saveMedicine() {
      if (this.isEdit) {
        this.$store.commit('inventory/UPDATE_MEDICINE', {
          index: this.formIndex,
          data: this.form,
        });
      } else {
        this.$store.commit('inventory/ADD_MEDICINE', this.form);
      }
      this.$router.push('/inventory/medicine-list');
    },
  },
};
</script>
