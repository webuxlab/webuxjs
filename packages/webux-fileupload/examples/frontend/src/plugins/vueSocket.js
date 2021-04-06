import store from "@/store";
import VueSocketIO from "vue-socket.io";
import Vue from "vue";
import InitSocketIO from "./socket";

const { socketIO } = InitSocketIO();

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socketIO,
    vuex: {
      store,
      actionPrefix: "socket_"
    },
    options: {
      useConnectionNamespace: true,
      namespaceName: "default"
    }
  })
);
