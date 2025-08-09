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
  SET_DOCTORS(state, doctors) {
    state.list = doctors;
  },
  ADD_DOCTOR(state, doctor) {
    state.list.push(doctor);
  },
  UPDATE_DOCTOR(state, { index, data }) {
    if (state.list[index]) {
      state.list.splice(index, 1, { ...state.list[index], ...data });
    }
  },
  TOGGLE_DOCTOR_STATUS(state, index) {
    if (state.list[index]) {
      state.list[index].active = !state.list[index].active;
    }
  },
  REMOVE_DOCTOR(state, index) {
    state.list.splice(index, 1);
  },
};

const actions = {
  async fetchDoctors({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const DoctorService = (await import('@/api/services/doctorService-enhanced')).default;
      const doctors = await DoctorService.getDoctors();
      commit('SET_DOCTORS', doctors);
    } catch (error) {
      if (error.message?.includes('Authentication') || error.message?.includes('permission')) {
        commit('SET_ERROR', error.message);
      } else {
        commit('SET_ERROR', 'Failed to load doctors. Please try again.');
      }
      console.error('Error loading doctors:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async addDoctor({ commit }, doctor) {
    try {
      const DoctorService = (await import('@/api/services/doctorService-enhanced')).default;
      const newDoctor = await DoctorService.createDoctor(doctor);
      commit('ADD_DOCTOR', newDoctor);
    } catch (error) {
      throw new Error(error.message || 'Failed to add doctor');
    }
  },
  
  async updateDoctor({ commit, state }, { id, data }) {
    try {
      const DoctorService = (await import('@/api/services/doctorService-enhanced')).default;
      const updatedDoctor = await DoctorService.updateDoctor(id, data);
      
      const index = state.list.findIndex(d => d.id === id);
      if (index !== -1) {
        commit('UPDATE_DOCTOR', { index, data: updatedDoctor });
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to update doctor');
    }
  },
  
  async deleteDoctor({ commit, state }, id) {
    try {
      const DoctorService = (await import('@/api/services/doctorService-enhanced')).default;
      await DoctorService.deleteDoctor(id);
      
      const index = state.list.findIndex(d => d.id === id);
      if (index !== -1) {
        commit('REMOVE_DOCTOR', index);
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to delete doctor');
    }
  },
  
  async toggleDoctorStatus({ commit, state }, id) {
    try {
      const DoctorService = (await import('@/api/services/doctorService-enhanced')).default;
      const doctor = state.list.find(d => d.id === id);
      
      if (doctor) {
        const updatedDoctor = await DoctorService.updateDoctor(id, { active: !doctor.active });
        
        const index = state.list.findIndex(d => d.id === id);
        if (index !== -1) {
          commit('UPDATE_DOCTOR', { index, data: updatedDoctor });
        }
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to update doctor status');
    }
  },
};

const getters = {
  doctors: (state) => state.list,
  activeDoctors: (state) => state.list.filter(d => d.active),
  loading: (state) => state.loading,
  error: (state) => state.error,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
