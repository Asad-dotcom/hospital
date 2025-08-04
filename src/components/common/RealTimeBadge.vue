<template>
  <div v-if="visible" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
    <div class="toast show align-items-center text-white bg-info border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          {{ message }}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="visible = false"></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'You have a new notification.',
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  mounted() {
    if (this.autoHide) {
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    }
  },
};
</script>
