<template>
  <button class="btn btn-outline-success btn-sm mt-2" @click="downloadFile">
    Download
  </button>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
    filename: {
      type: String,
      default: 'document.txt',
    },
  },
  methods: {
    downloadFile() {
      const data = `
Patient: ${this.content.patient}
Doctor: ${this.content.doctor}
Appointment ID: ${this.content.appointmentId}
Date: ${this.content.date}

Medicines:
${this.content.medicines}
      `.trim();

      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.filename;
      link.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>
