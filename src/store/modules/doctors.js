const state = {
  list: [],
};

const mutations = {
  ADD_DOCTOR(state, doctor) {
    state.list.push({
      ...doctor,
      id: Date.now(), // Simple ID generation
    });
  },
  UPDATE_DOCTOR(state, { index, data }) {
    if (state.list[index]) {
      state.list.splice(index, 1, { ...state.list[index], ...data });
    }
  },
   DELETE_DOCTOR(state, index) {
    if (index >= 0 && index < state.list.length) {
      state.list.splice(index, 1)
    }
  },
  TOGGLE_DOCTOR_STATUS(state, index) {
    if (state.list[index]) {
      state.list[index].active = !state.list[index].active;
    }
  },
};

const actions = {
  addDoctor({ commit }, doctor) {
    commit('ADD_DOCTOR', doctor);
  },
  updateDoctor({ commit }, payload) {
    commit('UPDATE_DOCTOR', payload);
  },
  toggleDoctorStatus({ commit }, index) {
    commit('TOGGLE_DOCTOR_STATUS', index);
  },
};

const getters = {
  doctors: (state) => state.list,
  activeDoctors: (state) => state.list.filter(d => d.active),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
