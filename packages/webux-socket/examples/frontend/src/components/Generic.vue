<template>
  <div id="test" class="container">
    <div class="text-center mx-auto mt-2">
      <h1 class="text-center">Tests</h1>
      <div class="isLoading" v-if="isLoading">
        <Loading />
      </div>
      <p>{{errorMessage}}</p>
      <div class="myContent">
        <div class="shadow p-3 mb-5 bg-white rounded">
          <div class="card">
            <div class="card-body">
              <div class="card-title">Title</div>
              <div class="card-text">
                <form @submit="SendForm"></form>
                <div class="results">
                  <div class="user">
                    <pre>{{user}}</pre>
                  </div>
                  <div class="profile">
                    <pre>{{profile}}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading/Page";
import { mapGetters } from "vuex";

export default {
  name: "Generic",
  components: {
    Loading
  },
  computed: {
    ...mapGetters([
      "isLoading",
      "successMessage",
      "errorMessage",
      "user",
      "profile",
      "errorMessage"
    ])
  },
  methods: {
    SendForm() {
      console.log("Hi!");
    }
  },
  mounted() {
    if (!this.$store.getters.userInit || !this.$store.getters.profileInit) {
      this.$store.dispatch("setLoading");
      console.log(this.$socket);
      console.log(this.$sockets);
      this.$socket.emit("findUser");
      this.$socket.profile.emit("findProfile");
    }
  }
};
</script>
