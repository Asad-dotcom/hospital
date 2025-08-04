const state = {
  list: [],
};

const mutations = {
  ADD_APPOINTMENT(state, appointment) {
    state.list.push({
      ...appointment,
      id: Date.now(), // Simple ID generation
      patient: 'Current Patient', // In a real app, this would come from the logged-in user
    });
  },
  UPDATE_APPOINTMENT_STATUS(state, { index, status }) {
    if (state.list[index]) {
      state.list[index].status = status;
    }
  },
};

const actions = {
  addAppointment({ commit }, appointment) {
    commit('ADD_APPOINTMENT', appointment);
  },
  updateAppointmentStatus({ commit }, payload) {
    commit('UPDATE_APPOINTMENT_STATUS', payload);
  },
};

const getters = {
  appointments: (state) => state.list,
  pendingAppointments: (state) => state.list.filter(a => a.status === 'Pending'),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
