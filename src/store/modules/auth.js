import authService from '@/api/services/authService'

const state = {
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  LOGOUT(state) {
    state.currentUser = null
    state.token = null
  }
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const data = await authService.login(credentials)
      const token = data.token
      const user = data.user
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      commit('SET_TOKEN', token)
      commit('SET_CURRENT_USER', user)
      commit('SET_LOADING', false)
      
      return data
    } catch (error) {
      commit('SET_ERROR', error.message || 'Login failed')
      commit('SET_LOADING', false)
      throw error
    }
  },

  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const data = await authService.register(userData)
      commit('SET_LOADING', false)
      return data
    } catch (error) {
      commit('SET_ERROR', error.message || 'Registration failed')
      commit('SET_LOADING', false)
      throw error
    }
  },

  logout({ commit }) {
    authService.logout()
    commit('LOGOUT')
  },

  async checkAuth({ commit }) {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    
    if (token && user) {
      commit('SET_TOKEN', token)
      commit('SET_CURRENT_USER', user)
      return true
    }
    return false
  }
}

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.currentUser,
  loading: (state) => state.loading,
  error: (state) => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
