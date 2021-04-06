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

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO("http://127.0.0.1:1339/general", {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    }),
    vuex: {
      store,
      actionPrefix: "socket_general_",
    },
    options: {
      useConnectionNamespace: true,
      namespaceName: "general"
    },
  })
);