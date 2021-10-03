<template>
  <v-app id="inspire">
      <v-card
        color="#F6F0E0"
        flat
        height="1000px"
        tile
      >
        <v-toolbar extended color="white">
          <v-toolbar-title id="title">Documents</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn id="goHome" v-on:click="goHome()" icon>
            <v-icon v-on:click="goHome()">mdi-file-document-edit-outline</v-icon>
          </v-btn>
          <v-btn id="logout" icon @click="logUserOut">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar>
        <section>
            <div class="saveddocs">
              <h1 class="subtitle has-text-centered">My documents:</h1>
              <div class="alldocs">
                <div class="documents" v-for="(item) in mydoc" :key="item._id">
                    <v-btn
                    id="edit"
                    style="margin-right:10px; margin-bottom:10px"
                    v-on:click="editdoc(item)"
                    v-bind:class="{ active: item._id === selected }"
                    >EDIT</v-btn>
                    <v-btn
                    style="margin-bottom:10px"
                    v-on:click="deletedoc(item._id)"
                    >DELETE</v-btn>
                    <div class="docHeading" v-html="item.documentHeading"></div>
                    <div class="docText" v-html="item.documentText"></div>
                </div>
              </div>
              <h1 class="subtitle has-text-centered">Shared documents:</h1>
              <div class="alldocs">
                <div class="documents" v-for="(item) in shareddoc" :key="item._id">
                    <v-btn
                    id="edit"
                    style="margin-right:10px; margin-bottom:10px"
                    v-on:click="editdoc(item)"
                    v-bind:class="{ active: item._id === selected }"
                    >EDIT</v-btn>
                    <v-btn
                    style="margin-bottom:10px"
                    v-on:click="deletedoc(item._id)"
                    >DELETE</v-btn>
                    <div class="docHeading" v-html="item.documentHeading"></div>
                    <div class="docText" v-html="item.documentText"></div>
                </div>
              </div>
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
      editalert: false
    };
  },
  async mounted() {
    const response = await axios.get("https://jsramverk-editor-saji19.azurewebsites.net/");
    this.items = response.data.editorDocuments;
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].userId === Vue.prototype.$currentuserID) {
              console.log(this.items[i].documentText)
              this.mydoc.push(this.items[i]);
        }
        for (var j = 0; j < this.items.length; j++) {
           if (this.items[i].sharedWith[j] === Vue.prototype.$currentuserID) {
              this.shareddoc.push(this.items[i]);
           }
        }
    }
  },
  methods: {
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
      console.log(id)
      await axios.delete(`https://jsramverk-editor-saji19.azurewebsites.net/${id}`);
      const response = await axios.get("https://jsramverk-editor-saji19.azurewebsites.net/");
      this.items = response.data.editorDocuments;
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

.alldocs {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  margin-top: 20px;
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
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
}

.docHeading {
    border-bottom: 1px dotted black;
    font-weight: bold;
    color: red;
    padding-bottom: 5px;
}

.docText {
    padding-top: 5px;
}
</style>