<template>
  <v-app id="inspire">
      <v-card
        color="#F8F9FA"
        flat
        height="1000px"
        tile
      >
        <v-toolbar color="#5C84F1">
          <v-toolbar-title style="color: white;" id="title">WELCOME {{ this.userName }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon v-on:click="showDoc()">
            <v-icon style="color: white;" v-on:click="showDoc()">mdi-file-document-multiple-outline</v-icon>
          </v-btn>
          <v-btn icon @click="logUserOut">
            <v-icon style="color: white;">mdi-logout</v-icon>
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
      userName: ""
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

      var uri = this.user.name;
      var dec = decodeURIComponent(escape(uri));
      Vue.prototype.$currentuserID = this.user._id;
      Vue.prototype.$currentuserName = dec;
      this.userName = Vue.prototype.$currentuserName;
  }
};
</script>