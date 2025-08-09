// store/modules/auth.js
import AuthService from '@/api/services/authService'

const state = {
  user: null,
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
  SET_USER(state, user) {
    state.user = user
  }
}

const actions = {
  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const { token, user } = await AuthService.register(userData)
      commit('SET_USER', user || null)
      return { token, user }
    } catch (error) {
      commit('SET_ERROR', error.message || 'Registration failed')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

 async login({ commit }, credentials) {
  commit('SET_LOADING', true)
  commit('SET_ERROR', null)
  try {
    const { token, user } = await AuthService.login(credentials)
    commit('SET_USER', user)
    return { token, user }
  } catch (error) {
    commit('SET_ERROR', error.message || 'Login failed')
    throw error
  } finally {
    commit('SET_LOADING', false)
  }
}
,

  logout({ commit }) {
    AuthService.logout()
    commit('SET_USER', null)
  }
}

const getters = {
  isAuthenticated: () => AuthService.isAuthenticated(),
  currentUser: () => AuthService.getUser(),
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
