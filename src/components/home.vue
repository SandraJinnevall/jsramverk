<template>
  <v-app id="inspire">
      <v-card
        color="#F6F0E0"
        flat
        height="1000px"
        tile
      >
        <v-toolbar extended color="white">
          <v-toolbar-title id="title">WELCOME {{ user.name }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon v-on:click="showDoc()">
            <v-icon v-on:click="showDoc()">mdi-file-document-multiple-outline</v-icon>
          </v-btn>
          <v-btn icon @click="logUserOut">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar>
            <section>
            <div class="container mt-5">
              <div class="row">
                <TextEditor/>
              </div>
            </div>
          </section>
      </v-card>
    </v-app>
</template>
<script>
import VueJwtDecode from "vue-jwt-decode";
import TextEditor from './TextEditor.vue'

import Vue from 'vue';

export default {
  components: {
    TextEditor,
  },
  data: function() {
    return {
      user: {},
    };
  },
  methods: {
    logUserOut() {
      localStorage.removeItem("jwt");
      Vue.prototype.$currentuserID = "";
      Vue.prototype.$currentuserName = "";
      this.$router.push("/", ()=>{});
    },
    showDoc() {
      this.$router.push("/savedDocuments", ()=>{});
    }
  },
  created() {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.user = decoded;
      Vue.prototype.$currentuserID = this.user._id;
  }
};
</script>