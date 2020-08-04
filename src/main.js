import Vue from 'vue'
import App from './App.vue'
import store from './store/Index'
import router from './router/Index.js'
import vuetify from './plugins/vuetify'
import * as filters from './filters/Index'

Vue.config.productionTip = false
Vue.prototype.$global = {islogin: false, offline: false, wallet: {}};

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')



