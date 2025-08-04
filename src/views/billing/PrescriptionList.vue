<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>Prescription List</h3>
      <div>
        <button class="btn btn-success me-2" @click="exportExcel">
          <i class="bi bi-file-earmark-spreadsheet me-1"></i>Export Excel
        </button>
        <button class="btn btn-danger" @click="exportPDF">
          <i class="bi bi-file-earmark-pdf me-1"></i>Export PDF
        </button>
      </div>
    </div>

    <div v-if="prescriptions.length === 0" class="alert alert-secondary">
      No prescriptions available.
    </div>

    <div v-for="(prescription, i) in prescriptions" :key="i" class="card mb-3">
      <div class="card-header d-flex justify-content-between">
        <span>{{ prescription.patient }} - {{ prescription.date }}</span>
        <span class="badge bg-primary">ID: {{ prescription.appointmentId }}</span>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p><strong>Doctor:</strong> {{ prescription.doctor }}</p>
            <p v-if="prescription.notes"><strong>Notes:</strong> {{ prescription.notes }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Medicines:</strong></p>
            <ul class="list-group">
              <li 
                v-for="(med, index) in prescription.medicines" 
                :key="index" 
                class="list-group-item"
              >
                <strong>{{ med.name }}</strong> - {{ med.dosage }}, {{ med.frequency }} for {{ med.duration }}
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-3 d-flex justify-content-end">
          <DownloadButton 
            :content="prescription" 
            :filename="`prescription-${prescription.appointmentId}.txt`" 
            class="me-2"
          />
          <button class="btn btn-outline-primary btn-sm" @click="printPrescription(i)">
            <i class="bi bi-printer me-1"></i>Print
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadButton from './DownloadButton.vue';

export default {
  components: {
    DownloadButton
  },
  computed: {
    prescriptions() {
      return this.$store.state.billing.prescriptions;
    },
    exportData() {
      return this.prescriptions.map(prescription => ({
        'Patient Name': prescription.patient,
        'Doctor Name': prescription.doctor,
        'Appointment ID': prescription.appointmentId,
        'Date': prescription.date,
        'Notes': prescription.notes,
        'Medicines': prescription.medicines.map(med => 
          `${med.name} - ${med.dosage}, ${med.frequency} for ${med.duration}`
        ).join('; ')
      }));
    }
  },
  methods: {
    exportExcel() {
      // Create a Blob with Excel data
      const data = this.exportData;
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(item => Object.values(item).map(value => `"${value}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'prescriptions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportPDF() {
      alert('PDF export would be implemented here with a library like jsPDF');
      // In a real implementation, you would use a library like jsPDF to generate PDFs
    },
    printPrescription(index) {
      const prescription = this.prescriptions[index];
      const printContent = `
        <html>
          <head>
            <title>Prescription - ${prescription.patient}</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .header { text-align: center; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .medicines { list-style-type: none; padding: 0; }
              .medicine { margin-bottom: 10px; padding: 5px; background: #f5f5f5; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Prescription</h2>
              <p><strong>Patient:</strong> ${prescription.patient}</p>
              <p><strong>Date:</strong> ${prescription.date}</p>
              <p><strong>Doctor:</strong> ${prescription.doctor}</p>
            </div>
            <div class="section">
              <h3>Medicines:</h3>
              <ul class="medicines">
                ${prescription.medicines.map(med => `
                  <li class="medicine">
                    <strong>${med.name}</strong> - ${med.dosage}, ${med.frequency} for ${med.duration}
                  </li>
                `).join('')}
              </ul>
            </div>
            ${prescription.notes ? `<div class="section"><h3>Notes:</h3><p>${prescription.notes}</p></div>` : ''}
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  },
};
</script>
