const state = {
  user: {},
  userInit: false
};

const mutations = {
  INIT_USER(state, user) {
    state.user = user;
    state.userInit = true;
  },
  EDIT_USER(state, user) {
    const updEntry = { ...state.user };
    updEntry[user._id] = user;
    state.user = {
      ...updEntry
    };
  },
  REMOVE_USER(state, userID) {
    let user = { ...state.user };
    delete user[userID];
    state.user = user;
  },
  ADD_USER(state, user) {
    state.user = {
      [user._id]: user,
      ...state.user
    };
  }
};

const actions = {
  socket_userFound({ commit, dispatch }, data) {
    commit("INIT_USER", data);
    dispatch("doneLoading");
  },
  socket_userUpdated({ commit, dispatch }, data) {
    commit("EDIT_USER", data);
    dispatch("doneLoading");
  },
  socket_userCreated({ commit, dispatch }, data) {
    commit("ADD_USER", data);
    dispatch("doneLoading");
  },
  socket_userRemoved({ commit, dispatch }, data) {
    commit("REMOVE_USER", data._id);
    dispatch("doneLoading");
  }
};

const getters = {
  user: state => {
    return state.user;
  }
};

export default {
  actions,
  mutations,
  state,
  getters
};
