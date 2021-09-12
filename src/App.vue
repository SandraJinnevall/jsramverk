<template>
  <div id="app">
    <div class="comp">
        <component :is="component" />
    </div>
    <div class="btn">
        <v-btn
          id="btn-doc"
          v-if="show === true"
          elevation="2" 
          v-on:click="showsaveddocs()"
        >{{this.showbtnname}}</v-btn>
        <v-btn
          elevation="2" 
          v-on:click="tabHandler(component)"
        >{{this.button}}</v-btn>
    </div>
    </div>
</template>

<script>
import StartPage from './components/StartPage.vue'
import TextEditor from './components/TextEditor.vue'
import SavedDocuments from './components/savedDocuments.vue'
import Vue from 'vue';


export default {
  name: 'App',
  components: {
    StartPage,
    TextEditor,
    SavedDocuments  
  },
  data () {
    console.log(this.$currentdoc);
    return {
      component: StartPage,
      button: "Try me!",
      show: false,
      showbtnname: "", 
    }
  },
  methods: {
    tabHandler(comp) {
      this.show = false;
      console.log("comp", comp)
      if (comp === StartPage) {
        Vue.prototype.$currentdoc._id = "";
        Vue.prototype.$currentdoc.documentHeading = "";
        Vue.prototype.$currentdoc.documentText = "";
        this.component = TextEditor;
        this.button = "Go back to startpage!"
        this.show = true;
        this.showbtnname = "Se saved docs!"
      } else if (comp === TextEditor) {
        this.component = StartPage;
        this.button = "Try me!"
      } else if (comp === SavedDocuments || comp === "change") {
        this.component = TextEditor;
        this.button = "Go back to startpage!"
        this.show = true;
      }

      console.log("this", this.component)
    },
    showsaveddocs() {
      console.log("see", this.component)
      this.show = false;
      this.component = SavedDocuments;
      this.button = "Go back to texteditor!"
      Vue.prototype.$currentdoc._id = "";
      Vue.prototype.$currentdoc.documentHeading = "";
      Vue.prototype.$currentdoc.documentText = "";
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 100%;
}

.comp {
  display: inline-block;
  width: 100%;
}

.btn {
  margin-top: 10px;
  display: inline-block;
  width: 100%;
}

.btn #btn-doc {
  background-color: blue;
  color: white;
  margin: 12px;

}

.theme--light .v-btn .v-btn--has-bg {
  background-color: transparent;
}

</style>
