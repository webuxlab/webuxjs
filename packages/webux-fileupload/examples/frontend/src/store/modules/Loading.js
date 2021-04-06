const state = {
  isLoading: false
};

const mutations = {
  SET_LOADING: state => {
    state.isLoading = true;
  },
  DONE_LOADING: state => {
    state.isLoading = false;
  }
};

const actions = {
  setLoading: ({ commit }) => {
    commit("SET_LOADING");
  },
  doneLoading: ({ commit }) => {
    commit("DONE_LOADING");
  }
};

const getters = {
  isLoading: state => {
    return state.isLoading;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
