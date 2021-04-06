## vue-socket.io

The current workaround to support multiple namespaces

```
Vue-socketio

git clone https://github.com/MetinSeylan/Vue-Socket.io.git

git checkout 8988085bef6bbf9ecdb5fced6b4220d5eb853bd3

npm install

npm run build

Copy/Move the dist/ to the node_modules/vue-socket.io/ directory


Plugins/socket.js

import store from "@/store";
import SocketIO from "socket.io-client";
import VueSocketIO from "vue-socket.io";
import Vue from "vue";

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("http://127.0.0.1:1339/profile", {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    }),
    vuex: {
      store,
      actionPrefix: "socket_profile_",
    },
    options: {
      useConnectionNamespace: true,
      namespaceName: "profile",
    },
  })
);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("http://127.0.0.1:1339/", {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    }),
    vuex: {
      store,
      actionPrefix: "socket_",
    },
    options: {
      useConnectionNamespace: true,
      namespaceName: "default"
    },
  })
);

app.vue

this.$socket.connect();
this.$socket.profile.connect();

main.js

import "@/plugins/socket";

Generic.js

mounted() {
    if (!this.$store.getters.userInit || !this.$store.getters.profileInit) {
      this.$store.dispatch("setLoading");
      this.$socket.emit("findUser");
      this.$socket.profile.emit("findProfile");
    }
  }

Profile.js

const state = {
  profile: {},
  profileInit: false
};

const mutations = {
  INIT_PROFIILE(state, profile) {
    state.profile = profile;
    state.profileInit = true;
  }
};

const actions = {
  socket_profile_profileFound({ commit, dispatch }, data) {
    commit("INIT_PROFIILE", data);
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

User.js

const state = {
  user: {},
  userInit: false
};

const mutations = {
  INIT_USER(state, user) {
    state.user = user;
    state.userInit = true;
  }
};

const actions = {
  socket_userFound({ commit, dispatch }, data) {
    commit("INIT_USER", data);
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

```
