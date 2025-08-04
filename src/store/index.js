// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import auth from './modules/auth';
import patients from './modules/patients';
import doctors from './modules/doctors';
import appointments from './modules/appointments';
import inventory from './modules/inventory';
import billing from './modules/billing';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'hospital-system',
  storage: window.localStorage,
  reducer: (state) => ({
    auth: state.auth,
    patients: state.patients,
    doctors: state.doctors,
    appointments: state.appointments,
    inventory: state.inventory,
    billing: state.billing,
  }),
});

export default new Vuex.Store({
  modules: {
    auth,
    patients,
    doctors,
    appointments,
    inventory,
    billing,
  },
  plugins: [vuexPersist.plugin],
});
