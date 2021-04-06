import Vue from "vue";


import store from "./store";
console.log("loading main")
import "@/plugins/vueSocket";
import "@/plugins/vueCookies";
import App from "./App.vue";

import "./registerServiceWorker";
import router from "./router";
import http from "@/plugins/axios";

import "bootstrap";
import "jquery";
import "popper.js";
import "bootstrap/dist/css/bootstrap.min.css";

Vue.prototype.$http = http;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
