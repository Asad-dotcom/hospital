import AppointmentService from '../../api/services/appointmentService'

const state = {
  appointments: [],
  loading: false,
  error: null
}

const mutations = {
  SET_APPOINTMENTS(state, appointments) {
    state.appointments = appointments
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchAppointments({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await AppointmentService.getAllAppointments(params)
      commit('SET_APPOINTMENTS', response.data)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to fetch appointments')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateStatus({ commit }, { id, status }) {
    try {
      await AppointmentService.updateAppointmentStatus(id, status)
      commit('SET_ERROR', null)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to update status')
      throw error
    }
  },
  
  async createAppointment({ commit }, appointmentData) {
    commit('SET_LOADING', true)
    try {
      const response = await AppointmentService.createAppointment(appointmentData)
      commit('SET_ERROR', null)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to create appointment')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async deleteAppointment({ commit }, id) {
    try {
      await AppointmentService.deleteAppointment(id)
      commit('SET_ERROR', null)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message || 'Failed to delete appointment')
      throw error
    }
  }
}

const getters = {
  appointments: state => state.appointments,
  pendingAppointments: state => state.appointments.filter(a => a.status === 'pending'),
  isLoading: state => state.loading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}