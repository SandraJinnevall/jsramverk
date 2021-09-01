<template>
  <div id="app">
    <div class="comp">
        <component v-bind:is="component" />
    </div>
    <div class="btn">
        <v-btn
          elevation="2" 
          v-on:click="tabHandler"
        >{{this.button}}</v-btn>
    </div>
  </div>
</template>

<script>
import StartPage from './components/StartPage.vue'
import TextEditor from './components/TextEditor.vue'

export default {
  name: 'App',
  components: {
    StartPage,
    TextEditor
    
  },
  data () {
    return {
      component: StartPage,
      button: "Try me!" 
    }
  },
  methods: {
    tabHandler() {
      if (this.component === StartPage) {
        this.component = TextEditor;
        this.button = "Changed my mind, go back!"
      } else {
        this.component = StartPage;
        this.button = "Try me!"
      }
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

</style>
