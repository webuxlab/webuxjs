const state = {
  success: "",
  error: "",
  global: {
    error: "",
    success: ""
  }
};

const mutations = {
  SET_SUCCESS: (state, message) => {
    state.success = message;
  },
  RESET_SUCCESS: state => {
    state.success = "";
  },
  SET_ERROR: (state, error) => {
    if (error.response && error.response.data.message) {
      state.error = error.response.data.message;
    } else if (typeof error.message === "string") {
      state.error = error.message;
    } else if (typeof error === "string") {
      state.error = error;
    } else {
      state.error = "An error occured";
    }
  },
  RESET_ERROR: state => {
    state.error = "";
  },
  SET_GLOBAL_ERROR: (state, message) => {
    state.global.error = message;
  },
  SET_GLOBAL_SUCCESS: (state, message) => {
    state.global.success = message;
  }
};

const actions = {
  socket_gotError: ({ commit, dispatch }, message) => {
    commit("SET_ERROR", message);
    dispatch("doneLoading");
  },
  socket_profile_gotError: ({ commit, dispatch }, message) => {
    commit("SET_ERROR", message);
    dispatch("doneLoading");
  },
  setSuccess: ({ commit }, message) => {
    commit("SET_SUCCESS", message);
  },
  resetSuccess: ({ commit }) => {
    commit("RESET_SUCCESS");
  },
  setError: ({ commit }, message) => {
    commit("SET_ERROR", message);
  },
  resetError: ({ commit }) => {
    commit("RESET_ERROR");
  },
  resetMessages: ({ commit }) => {
    commit("RESET_SUCCESS");
    commit("RESET_ERROR");
  },
  setGlobalError: ({ commit }, message) => {
    commit("SET_GLOBAL_ERROR", message);
  },
  setGlobalSuccess: ({ commit }, message) => {
    commit("SET_GLOBAL_SUCCESS", message);
  }
};

const getters = {
  successMessage: state => {
    return state.success;
  },
  errorMessage: state => {
    return state.error;
  },
  globalError: state => {
    return state.global.error;
  },
  globalSuccess: state => {
    return state.global.success;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
