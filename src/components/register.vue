<template>
   <v-app id="inspire">
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                <v-alert v-if="emailExist" dismissible type="info">
                    Oh no! The email is already in use...
                </v-alert>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                          <v-text-field
                              prepend-icon="person"
                              name="name"
                              label="Name"
                              type="text"
                              v-model="register.name"
                           ></v-text-field>
                           <v-text-field
                              prepend-icon="email"
                              name="email"
                              label="Email"
                              type="text"
                              v-model="register.email"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              prepend-icon="lock"
                              name="password"
                              label="Password"
                              type="password"
                              v-model="register.password"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <p><router-link to="/"
                            >Already have an account</router-link
                          >
                        </p>
                        <v-spacer></v-spacer>
                        <v-btn v-on:click="registerUser()" color="primary">Create</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
   </v-app>
</template>
<script>
import axios from "axios";

export default {
  data: function() {
    return {
      register: {
        name: "",
        email: "",
        password: ""
      },
      emailExist: false
    };
  },
  methods: {
    async registerUser() {
       try {
        let response = await axios.post("https://jsramverk-editor-saji19.azurewebsites.net/user/register", this.register);
        let token = response.data.token;
        if (token) {
          localStorage.setItem("jwt", token);
          this.$router.push("/");
        } else {
          console.log("token doesn't exist")
        }
      } catch (err) {
          if (err.response.status === 409) {
              this.emailExist = true;
          }
          console.log("STATUS:", err.response.status);
      }
    }
  }
};
</script>