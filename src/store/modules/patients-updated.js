const state = {
  list: [],
};

const mutations = {
  SET_PATIENTS(state, patients) {
    state.list = patients;
  },
  ADD_PATIENT(state, patient) {
    state.list.push({
      ...patient,
      username: patient.username || '',
      password: patient.password || '',
      id: patient.id || Date.now(),
      createdAt: patient.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
  UPDATE_PATIENT(state, { id, data }) {
    const index = state.list.findIndex(p => p.id === id);
    if (index !== -1) {
      state.list.splice(index, 1, {
        ...state.list[index],
        ...data,
        updatedAt: new Date().toISOString(),
      });
    }
  },
  DELETE_PATIENT(state, id) {
    state.list = state.list.filter(p => p.id !== id);
  },
  TOGGLE_PATIENT_STATUS(state, id) {
    const patient = state.list.find(p => p.id === id);
    if (patient) {
      patient.active = !patient.active;
      patient.updatedAt = new Date().toISOString();
    }
  },
};

const actions = {
  async fetchPatients({ commit }) {
    try {
      // Fetch users with role 'patient' from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const patients = users.filter(user => user.role === 'patient');
      commit('SET_PATIENTS', patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      commit('SET_PATIENTS', []);
    }
  },
  async savePatients({ state, rootState }) {
    try {
      // Get all users from localStorage
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Update or add patients in the users array
      state.list.forEach(patient => {
        const index = allUsers.findIndex(u => u.id === patient.id);
        if (index !== -1) {
          allUsers[index] = patient;
        } else {
          allUsers.push(patient);
        }
      });
      
      // Save back to localStorage
      localStorage.setItem('users', JSON.stringify(allUsers));
    } catch (error) {
      console.error('Error saving patients:', error);
    }
  },
  async addPatient({ commit, dispatch }, patient) {
    // Ensure the role is set to 'patient'
    const patientWithRole = {
      ...patient,
      role: 'patient',
      active: true
    };
    commit('ADD_PATIENT', patientWithRole);
    await dispatch('savePatients');
  },
  async loadSignUpPatients({ dispatch }) {
    await dispatch('fetchPatients');
  },
};

const getters = {
  patients: (state) => state.list,
  activePatients: (state) => state.list.filter(p => p.active),
  getPatientById: (state) => (id) => state.list.find(p => p.id === id),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
