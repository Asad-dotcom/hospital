const state = {
  users: [],
  currentUser: null,
};

const mutations = {
  registerUser(state, user) {
    const existing = state.users.find(
      (u) => u.email === user.email && u.role === user.role
    );
    if (!existing) {
      state.users.push(user);
    }
  },
  setCurrentUser(state, user) {
    state.currentUser = user;
  },
  logout(state) {
    state.currentUser = null;
  },
};

const actions = {
  login({ commit, state }, { email, password, role }) {
    return new Promise((resolve, reject) => {
      
      const user = state.users.find(
        (u) => u.email === email && u.password === password && u.role === role
      );
      if (user) {
        // Generate a simple token for authentication
        const token = btoa(JSON.stringify({ email: user.email, role: user.role }));
        localStorage.setItem('token', token);
        commit("setCurrentUser", user);
        resolve();
      } else {
        reject("Invalid credentials");
      }
    });
  },
  logout({ commit }) {
    localStorage.removeItem('token');
    commit("logout");
  },
};

const getters = {
  isAuthenticated: (state) => !!state.currentUser,
  currentUser: (state) => state.currentUser,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
