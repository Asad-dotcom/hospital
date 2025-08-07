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
      const PatientService = (await import('@/api/services/patientService')).default;
      const patients = await PatientService.getPatients();
      commit('SET_PATIENTS', patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      commit('SET_PATIENTS', []);
    }
  },
  async savePatients({ state }) {
    try {
      const PatientService = (await import('@/api/services/patientService')).default;
      for (const patient of state.list) {
        if (patient.id) {
          await PatientService.updatePatient(patient.id, patient);
        } else {
          await PatientService.createPatient(patient);
        }
      }
    } catch (error) {
      console.error('Error saving patients:', error);
    }
  },
  async addPatient({ commit, dispatch }, patient) {
    try {
      const PatientService = (await import('@/api/services/patientService')).default;
      const patientWithRole = {
        ...patient,
        role: 'patient',
        active: true
      };
      const newPatient = await PatientService.createPatient(patientWithRole);
      commit('ADD_PATIENT', newPatient);
    } catch (error) {
      console.error('Error adding patient:', error);
    }
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
