const state = {
  list: [],
};

const mutations = {
  ADD_PATIENT(state, patient) {
    state.list.push({
      ...patient,
      id: Date.now(), // Simple ID generation
    });
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
