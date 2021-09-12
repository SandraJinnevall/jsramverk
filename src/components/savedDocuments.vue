<template>
  <div class="saveddocs">
    <h1 class="subtitle has-text-centered">Saved documents:</h1>
    <hr />
    <div class="alldocs">
      <div class="documents" v-for="(item) in items" :key="item._id">
          <v-btn
          style="margin-right:10px; margin-bottom:10px"
          v-on:click="editdoc(item)"
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
  </div>
</template>

<script>
import axios from "axios";
import Vue from 'vue';
import App from '../App.vue';

export default {
  name: "App",
  data() {
    return {
      items: [],
      documentText: "",
      editeddocumentText: "",
    };
  },
  async mounted() {
    const response = await axios.get("https://jsramverk-editor-saji19.azurewebsites.net/");
    console.log(response.data.editorDocuments);
    this.items = response.data.editorDocuments;
  },
  methods: {
    editdoc(item) {
      Vue.prototype.$currentdoc._id = item._id;
      Vue.prototype.$currentdoc.documentHeading = item.documentHeading;
      Vue.prototype.$currentdoc.documentText = item.documentText;
      App.methods.tabHandler("change");
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

.alldocs {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
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