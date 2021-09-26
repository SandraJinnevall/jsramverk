import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.prototype.$currentdoc = Vue.observable({
  _id: "123",
  documentText: "",
  documentHeading: ""
});

new Vue({
  el: '#app',
  vuetify,
  render: h => h(App)
}).$mount('#app')
