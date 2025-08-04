<template>
  <div class="container text-center py-5">
    <h1 class="display-4 text-danger">404</h1>
    <p class="lead">Page Not Found</p>
    <router-link to="/" class="btn btn-primary mt-3">
      Go Back Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
h1 {
  font-size: 6rem;
}
</style>
