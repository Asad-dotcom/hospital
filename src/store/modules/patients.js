const state = {
  list: [],
  loading: false,
  error: null,
};

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_PATIENTS(state, patients) {
    state.list = patients;
  },
  ADD_PATIENT(state, patient) {
    state.list.push(patient);
  },
  UPDATE_PATIENT(state, { index, data }) {
    if (state.list[index]) {
      state.list.splice(index, 1, { ...state.list[index], ...data });
    }
  },
  TOGGLE_PATIENT_STATUS(state, index) {
    if (state.list[index]) {
      state.list[index].active = !state.list[index].active;
    }
  },
};

const actions = {
  async fetchPatients({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const PatientService = (await import('@/api/services/patientService-enhanced')).default;
      const patients = await PatientService.getPatients();
      commit('SET_PATIENTS', patients);
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to fetch patients');
      console.error('Error fetching patients:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  addPatient({ commit }, patient) {
    commit('ADD_PATIENT', patient);
  },
  
  updatePatient({ commit }, payload) {
    commit('UPDATE_PATIENT', payload);
  },
  
  togglePatientStatus({ commit }, index) {
    commit('TOGGLE_PATIENT_STATUS', index);
  },
};

const getters = {
  patients: (state) => state.list,
  activePatients: (state) => state.list.filter(p => p.active),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
