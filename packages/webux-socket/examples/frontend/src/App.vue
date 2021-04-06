<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import http from "@/plugins/axios";
import { setCookies } from "@/plugins/cookies";

export default {
  mounted() {
    http
      .get("/giveme")
      .then(result => {
        //setCookies(result.data.accessToken.substring(0, 10));
        setCookies(result.data.accessToken);
      })
      .then(() => {
        this.$socket.connect();
        this.$socket.profile.connect();
        this.$socket.general.connect();
      });
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
