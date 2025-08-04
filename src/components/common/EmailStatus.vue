<template>
  <div class="mt-2">
    <span 
      class="badge d-inline-flex align-items-center"
      :class="badgeClass"
      :title="tooltipText"
    >
      <i :class="iconClass" class="me-1"></i>
      {{ status }}
      <span 
        v-if="showDetails" 
        class="badge bg-light text-dark ms-2"
        style="font-size: 0.6em;"
      >
        {{ details }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'Pending', // Possible: Sent, Failed, Pending
    },
    details: {
      type: String,
      default: ''
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    badgeClass() {
      switch (this.status.toLowerCase()) {
        case 'sent':
          return 'bg-success';
        case 'failed':
          return 'bg-danger';
        case 'pending':
          return 'bg-warning text-dark';
        case 'scheduled':
          return 'bg-info';
        case 'delivered':
          return 'bg-success';
        case 'opened':
          return 'bg-primary';
        default:
          return 'bg-secondary';
      }
    },
    iconClass() {
      switch (this.status.toLowerCase()) {
        case 'sent':
          return 'bi bi-send-check';
        case 'failed':
          return 'bi bi-exclamation-circle';
        case 'pending':
          return 'bi bi-clock';
        case 'scheduled':
          return 'bi bi-calendar';
        case 'delivered':
          return 'bi bi-envelope-check';
        case 'opened':
          return 'bi bi-envelope-open';
        default:
          return 'bi bi-envelope';
      }
    },
    tooltipText() {
      switch (this.status.toLowerCase()) {
        case 'sent':
          return 'Email has been sent';
        case 'failed':
          return 'Email failed to send';
        case 'pending':
          return 'Email is pending';
        case 'scheduled':
          return 'Email is scheduled to be sent';
        case 'delivered':
          return 'Email has been delivered';
        case 'opened':
          return 'Email has been opened by recipient';
        default:
          return 'Email status unknown';
      }
    }
  },
};
</script>
