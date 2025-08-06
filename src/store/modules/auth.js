import authService from '@/api/services/authService'

const state = {
  currentUser: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
};

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
  },
  LOGOUT(state) {
    state.currentUser = null;
    state.token = null;
  }
};

const actions = {
  async login({ commit }, { email, password, role }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const data = await authService.login({ email, password, role });
      const token = data.token;
      localStorage.setItem('token', token);
      commit('SET_TOKEN', token);
      // Fetch current user info
      const user = await authService.getCurrentUser();
      commit('SET_CURRENT_USER', user);
      commit('SET_LOADING', false);
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_LOADING', false);
      throw error;
    }
  },
  async register({ commit }, userData) {
    console.log(userData, 'userData .......')
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      await authService.register(userData);
      commit('SET_LOADING', false);
    } catch (error) {
      commit('SET_ERROR', error);
      commit('SET_LOADING', false);
      throw error;
    }
  },
  logout({ commit }) {
    authService.logout();
    commit('LOGOUT');
    localStorage.removeItem('token');
  }
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.currentUser,
  loading: (state) => state.loading,
  error: (state) => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
