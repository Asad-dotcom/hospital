import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Bootstrap CDN styles (optional if already added in HTML)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
