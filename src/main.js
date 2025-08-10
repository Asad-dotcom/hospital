import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import AppointmentService from '@/api/services/appointmentService'

// Bootstrap CDN styles (optional if already added in HTML)

Vue.config.productionTip = false;
Vue.prototype.$appointmentService = AppointmentService
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
