<template>
  <div class="saveddocs">
    <h1 class="subtitle has-text-centered">Saved documents:</h1>
    <p>Want to edit a document? Press "EDIT" on the document you want to change and then click "GO BACK TO TEXTEDITOR!"</p>
    <div class="alldocs">
      <div class="documents" v-for="(item) in items" :key="item._id">
          <v-btn
          style="margin-right:10px; margin-bottom:10px"
          v-on:click="editdoc(item)"
          v-bind:class="{ active: item._id === selected }"
          >EDIT</v-btn>
          <v-btn
          style="margin-bottom:10px"
          v-on:click="deletedoc(item._id)"
          >DELETE</v-btn>
          <div class="docHeading">
              {{ item.documentHeading }}
          </div>
          <div class="docText">
              {{ item.documentText }}
          </div>
      </div>
    </div>
    <v-alert v-if="editalert" dismissible type="info">
        Press "GO BACK TO TEXTEDITOR!" to edit the chosen document!
    </v-alert>
  </div>
</template>

<script>
import axios from "axios";
import Vue from 'vue';

export default {
  name: "App",
  data() {
    return {
      items: [],
      documentText: "",
      editeddocumentText: "",
      selected: "",
      editalert: false
    };
  },
  async mounted() {
    const response = await axios.get("https://jsramverk-editor-saji19.azurewebsites.net/");
    console.log(response.data.editorDocuments);
    this.items = response.data.editorDocuments;
  },
  methods: {
    editdoc(item) {
      this.editalert = true;
      this.selected = item._id;
      Vue.prototype.$currentdoc._id = item._id;
      Vue.prototype.$currentdoc.documentHeading = item.documentHeading;
      Vue.prototype.$currentdoc.documentText = item.documentText;
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
    width: 20%;
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