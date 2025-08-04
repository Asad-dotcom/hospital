<template>
  <div class="container py-4">
    <h3>Export Inventory</h3>

    <div class="mb-3">
      <h5>Inventory Summary</h5>
      <p>Total Medicines: {{ medicines.length }}</p>
      <p>Low Stock Items: {{ lowStockCount }}</p>
      <p>Near Expiry Items: {{ nearExpiryCount }}</p>
    </div>

    <!-- Hidden export components -->
    <json-excel
      ref="excelExporter"
      :data="exportData"
      :fields="excelFields"
      name="inventory.xls"
      class="d-none"
    />
    <json-excel
      ref="csvExporter"
      :data="exportData"
      :fields="csvFields"
      type="csv"
      name="inventory.csv"
      class="d-none"
    />

    <div class="d-flex gap-2 mb-4">
      <button class="btn btn-success" @click="downloadExcel">
        <i class="bi bi-file-earmark-spreadsheet me-2"></i>Download Excel
      </button>
      <button class="btn btn-primary" @click="downloadCSV">
        <i class="bi bi-file-earmark-text me-2"></i>Download CSV
      </button>
    </div>

    <!-- Data table for reference -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(med, index) in medicines" :key="index">
            <td>{{ med.name }}</td>
            <td>{{ med.quantity }}</td>
            <td>{{ med.expiry }}</td>
            <td>
              <span 
                v-if="med.quantity < 5" 
                class="badge bg-danger"
              >
                Low Stock
              </span>
              <span 
                v-else-if="isNearExpiry(med.expiry)" 
                class="badge bg-warning text-dark"
              >
                Near Expiry
              </span>
              <span 
                v-else-if="isExpired(med.expiry)" 
                class="badge bg-secondary"
              >
                Expired
              </span>
              <span v-else class="badge bg-success">Good</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import JsonExcel from 'vue-json-excel';

export default {
  components: {
    JsonExcel
  },
  data() {
    return {
      excelFields: {
        Name: 'Name',
        Quantity: 'Quantity',
        'Expiry Date': 'Expiry Date',
        Status: 'Status',
        'Days Until Expiry': 'Days Until Expiry'
      },
      csvFields: {
        Name: 'Name',
        Quantity: 'Quantity',
        'Expiry Date': 'Expiry Date',
        Status: 'Status',
        'Days Until Expiry': 'Days Until Expiry'
      }
    };
  },
  computed: {
    medicines() {
      return this.$store.state.inventory.medicines;
    },
    lowStockCount() {
      return this.medicines.filter(med => med.quantity < 5).length;
    },
    nearExpiryCount() {
      return this.medicines.filter(med => this.isNearExpiry(med.expiry) && !this.isExpired(med.expiry)).length;
    },
    exportData() {
      return this.medicines.map(med => ({
        Name: med.name,
        Quantity: med.quantity,
        'Expiry Date': med.expiry,
        Status: this.getMedicineStatus(med),
        'Days Until Expiry': this.daysUntilExpiry(med.expiry)
      }));
    }
  },
  methods: {
    isNearExpiry(expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 30 && diffDays > 0;
    },
    isExpired(expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      return expiry < today;
    },
    daysUntilExpiry(expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const diffTime = expiry - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    getMedicineStatus(medicine) {
      if (medicine.quantity < 5) return 'Low Stock';
      if (this.isExpired(medicine.expiry)) return 'Expired';
      if (this.isNearExpiry(medicine.expiry)) return 'Near Expiry';
      return 'Good';
    },
    downloadExcel() {
      // The JsonExcel component handles the download automatically
      // We just need to trigger it by clicking the component
      this.$refs.excelExporter.$el.click();
    },
    downloadCSV() {
      this.$refs.csvExporter.$el.click();
    }
  }
};
</script>
