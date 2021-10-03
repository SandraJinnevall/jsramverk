<template>
   <v-app id="inspire">
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-alert v-if="wrongAuth" dismissible type="info">
                      Oh no! Login failed, check authentication credentials.
                  </v-alert>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              prepend-icon="email"
                              name="email"
                              label="Email"
                              type="text"
                              v-model="login.email"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="lock"
                              name="password"
                              label="Password"
                              type="password"
                              v-model="login.password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <p><router-link to="/register"
                            >Create new account</router-link
                          >
                        </p>
                        <v-spacer></v-spacer>
                        <v-btn id="login" v-on:click="loginUser()" color="primary">Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
   </v-app>
</template>
<script>
import axios from "axios";
import Vue from 'vue';
export default {
  data: function() {
    return {
      login: {
        email: "",
        password: ""
      },
      wrongAuth: false
    };
  },
  methods: {
    async loginUser() {
      try {
        let response = await axios.post("https://jsramverk-editor-saji19.azurewebsites.net/user/login", this.login);
        console.log(response)
        let token = response.data.token;
        if (token) {
          localStorage.setItem("jwt", token);
          Vue.prototype.$currentuserID = response.data.user._id;
          Vue.prototype.$currentuserName = response.data.user.name;
          this.$router.push("/home");
        } 
      } catch (err) {
          if (err.response.status === 400) {
              this.wrongAuth = true;
          }
          console.log("STATUS:", err.response.status);
      }
    }
  }
};
</script>

<style>
body {
  background-color: #F6F0E0;
}

</style>