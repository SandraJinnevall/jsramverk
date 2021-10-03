import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.prototype.$currentuserID = "";
Vue.prototype.$howManyDocs = "";
Vue.prototype.$currentuserName = "";
Vue.prototype.$currentdoc = Vue.observable({
  _id: "",
  documentText: "",
  documentHeading: "",
  userId: "",
  sharedWith: [],
  ownerName: ""
});


new Vue({
  // el: '#app',
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
