const state = {
  profile: {},
  profileInit: false
};

const mutations = {
  INIT_PROFIILE(state, profile) {
    state.profile = profile;
    state.profileInit = true;
  },
  EDIT_PROFIILE(state, profile) {
    const updEntry = { ...state.profile };
    updEntry[profile._id] = profile;
    state.profile = {
      ...updEntry
    };
  },
  REMOVE_PROFIILE(state, profileID) {
    let profile = { ...state.profile };
    delete profile[profileID];
    state.profile = profile;
  },
  ADD_PROFIILE(state, profile) {
    state.profile = {
      [profile._id]: profile,
      ...state.profile
    };
  }
};

const actions = {
  socket_profile_profileFound({ commit, dispatch }, data) {
    commit("INIT_PROFIILE", data);
    dispatch("doneLoading");
  },
  socket_profile_profileUpdated({ commit, dispatch }, data) {
    commit("EDIT_PROFIILE", data);
    dispatch("doneLoading");
  },
  socket_profile_profileCreated({ commit, dispatch }, data) {
    commit("ADD_PROFIILE", data);
    dispatch("doneLoading");
  },
  socket_profile_profileRemoved({ commit, dispatch }, data) {
    commit("REMOVE_PROFIILE", data._id);
    dispatch("doneLoading");
  }
};

const getters = {
  profile: state => {
    return state.profile;
  }
};

export default {
  actions,
  mutations,
  state,
  getters
};
