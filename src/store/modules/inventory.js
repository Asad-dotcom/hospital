const state = {
  medicines: [],
};

const mutations = {
  ADD_MEDICINE(state, medicine) {
    state.medicines.push({
      ...medicine,
      id: Date.now(), // Simple ID generation
    });
  },
  UPDATE_MEDICINE(state, { index, medicine }) {
    if (state.medicines[index]) {
      state.medicines.splice(index, 1, medicine);
    }
  },
};

const actions = {
  addMedicine({ commit }, medicine) {
    commit('ADD_MEDICINE', medicine);
  },
  updateMedicine({ commit }, payload) {
    commit('UPDATE_MEDICINE', payload);
  },
};

const getters = {
  medicines: (state) => state.medicines,
  lowStockMedicines: (state) => state.medicines.filter(m => m.quantity < 5),
  expiredMedicines: (state) => {
    const now = new Date();
    return state.medicines.filter(m => new Date(m.expiry) < now);
  },
  nearExpiryMedicines: (state) => {
    const now = new Date();
    const in15Days = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    return state.medicines.filter(m => {
      const expiry = new Date(m.expiry);
      return expiry >= now && expiry <= in15Days;
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
