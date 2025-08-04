<template>
  <div class="container py-4">
    <h3>Medical History</h3>

    <div v-if="history.length === 0" class="alert alert-info mt-3">
      No medical history available.
    </div>

    <div class="accordion mt-3" id="historyAccordion">
      <div
        class="accordion-item"
        v-for="(entry, index) in history"
        :key="index"
      >
        <h2 class="accordion-header" :id="'heading' + index">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + index"
          >
            Visit on {{ entry.date }} - {{ entry.doctor }}
          </button>
        </h2>
        <div
          :id="'collapse' + index"
          class="accordion-collapse collapse"
          :aria-labelledby="'heading' + index"
          data-bs-parent="#historyAccordion"
        >
          <div class="accordion-body">
            <p><strong>Diagnosis:</strong> {{ entry.diagnosis }}</p>
            <p><strong>Prescription:</strong> {{ entry.prescription }}</p>
            <p><strong>Notes:</strong> {{ entry.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      history: [
        {
          date: '2025-07-20',
          doctor: 'Dr. Ahmad Khan',
          diagnosis: 'Hypertension',
          prescription: 'Amlodipine 5mg once daily',
          notes: 'Monitor BP regularly',
        },
        {
          date: '2025-06-10',
          doctor: 'Dr. Sara Ali',
          diagnosis: 'Seasonal Allergy',
          prescription: 'Antihistamines',
          notes: 'Avoid dust, wear mask',
        },
      ],
    };
  },
};
</script>
