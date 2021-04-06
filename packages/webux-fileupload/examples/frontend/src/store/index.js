import Vue from "vue";
import Vuex from "vuex";

import Loading from "@/store/modules/Loading";
import User from "@/store/modules/User";
import Profile from "@/store/modules/Profile";
import Handler from "@/store/modules/Handler";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Loading,
    User,
    Profile,
    Handler
  }
});
