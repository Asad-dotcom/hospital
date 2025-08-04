const state = {
  bills: [],
  prescriptions: [],
};

const mutations = {
  ADD_BILL(state, bill) {
    state.bills.push({
      ...bill,
      id: Date.now(), // Simple ID generation
    });
  },
  ADD_PRESCRIPTION(state, prescription) {
    state.prescriptions.push({
      ...prescription,
      id: Date.now(), // Simple ID generation
    });
  },
};

const actions = {
  addBill({ commit }, bill) {
    commit('ADD_BILL', bill);
  },
  addPrescription({ commit }, prescription) {
    commit('ADD_PRESCRIPTION', prescription);
  },
};

const getters = {
  bills: (state) => state.bills,
  prescriptions: (state) => state.prescriptions,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
