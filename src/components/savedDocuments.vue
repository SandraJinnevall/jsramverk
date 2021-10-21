<template>
  <v-app id="inspire">
      <v-card color="#F8F9FA" flat height="1000px" tile>
        <v-toolbar color="#5C84F1">
          <v-toolbar-title style="color: white;" id="title">Documents</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn id="goHome" v-on:click="goHome()" icon>
            <v-icon style="color: white;" v-on:click="goHome()">mdi-file-document-edit-outline</v-icon>
          </v-btn>
          <v-btn id="logout" icon @click="logUserOut">
            <v-icon style="color: white;">mdi-logout</v-icon>
          </v-btn>
        </v-toolbar>

        <section>
          <div style="display: inline-flex; width: 100%;">
              <v-expansion-panels style="width: 45%; height: 40px; padding-top: 50px; margin-right: 5%;">
                  <v-expansion-panel v-on:click="getUserDocs()">
                      <v-expansion-panel-header>My Documents</v-expansion-panel-header>
                      <v-expansion-panel-content v-if="showD === true">
                        <div style="margin-bottom: 30px;" class="documents" v-for="(item) in mydoc" :key="item._id">
                            <v-icon
                            id="edit"
                            style="margin-right:10px; margin-bottom:10px color: #333;"
                            v-on:click="editdoc(item)"
                            v-bind:class="{ active: item._id === selected }"
                            >mdi-pencil</v-icon>
                            <v-icon
                            style="margin-bottom:10px color: #333;"
                            v-on:click="deletedoc(item._id)"
                            >mdi-delete</v-icon>
                            <div class="docHeading" v-html="item.documentHeading"></div>
                            <div class="docText" v-html="item.documentText"></div>
                        </div>
                      </v-expansion-panel-content>
                  </v-expansion-panel>
              </v-expansion-panels>
              <v-expansion-panels style="width: 45%; height: 40px; padding-top: 50px; margin-right: 5%;">
                  <v-expansion-panel v-on:click="getSharedDocs()">
                      <v-expansion-panel-header>Shared with me</v-expansion-panel-header>
                      <v-expansion-panel-content v-if="showD === true">
                        <div class="documents" v-for="(item) in shareddoc" :key="item._id">
                          <v-icon
                          id="edit"
                          style="margin-right:10px; margin-bottom:10px color: #333;"
                          v-on:click="editdoc(item)"
                          v-bind:class="{ active: item._id === selected }"
                          >mdi-pencil</v-icon>
                          <div class="docHeading" v-html="item.documentHeading"></div>
                          <div class="docText" v-html="item.documentText"></div>
                      </div>
                      </v-expansion-panel-content>
                  </v-expansion-panel>
              </v-expansion-panels>
          </div>
          </section>
      </v-card>
    </v-app>
</template>

<script>
import axios from "axios";
import Vue from 'vue';

export default {
  name: "App",
  data: function() {
    return {
      items: [],
      mydoc: [],
      shareddoc: [],
      documentText: "",
      editeddocumentText: "",
      selected: "",
      editalert: false,
      showD: true,
    };
  },
  methods: {
    async getUserDocs() {
        this.showD = true;
        this.items = [];
        this.mydoc = [];
        const response = await axios.get("https://jsramverk-editor-saji19.azurewebsites.net/");
        this.items = response.data.editorDocuments;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].userId === Vue.prototype.$currentuserID) {
                  this.mydoc.push(this.items[i]);
            }
        }
    },
    async getSharedDocs() {
        this.showD = true;
        this.items = [];
        this.shareddoc = [];
        const response = await axios.get("https://jsramverk-editor-saji19.azurewebsites.net/");
        this.items = response.data.editorDocuments;
        for (var i = 0; i < this.items.length; i++) {
            for (var j = 0; j < this.items.length; j++) {
              if (this.items[i].sharedWith[j] === Vue.prototype.$currentuserID) {
                  this.shareddoc.push(this.items[i]);
              }
            }
        }
    },
    editdoc(item) {
      this.editalert = true;
      this.selected = item._id;
      Vue.prototype.$currentdoc._id = item._id;
      Vue.prototype.$currentdoc.documentHeading = item.documentHeading;
      Vue.prototype.$currentdoc.documentText = item.documentText;
      Vue.prototype.$currentdoc.sharedWith = item.sharedWith;
      Vue.prototype.$currentdoc.userId = item.userId;
      Vue.prototype.$currentdoc.ownerName = item.ownerName;
      this.$router.push("/home", ()=>{});
    },
    goHome() {
        this.$router.push("/home", ()=>{});
    },
    logUserOut() {
      localStorage.removeItem("jwt");
      Vue.prototype.$currentuserID = "";
      Vue.prototype.$currentuserName = "";
      this.$router.push("/");
    },
    async deletedoc(id) {
      this.showD = false;
      await axios.delete(`https://jsramverk-editor-saji19.azurewebsites.net/${id}`);
    }
  }
};
</script>

<style>
.saveddocs {
  margin: auto;
  margin-top: 3rem;
}
.icon {
  cursor: pointer;
}

.active {
  background-color: green !important;
}

.info {
  background-color: #2196f3 !important;
  border-color: #2196f3 !important;
}

.documents {
    /* border: 1px solid black; */
    padding: 20px;
    background: #f1f1f1;
    padding: 10px;
    margin: 10px;
    /* flex: 20%; */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-shadow: 0 0px 10px rgb(0 0 0 / 0.05);
    max-height: 150px;
    border-radius: 6px;
    border: 1px solid #dadce0;
}

.docHeading {
    border-bottom: 1px dotted black;
    font-weight: bold;
    color: #5C84F1;
    padding-bottom: 5px;
}

.docText {
    padding-top: 5px;
}
</style>