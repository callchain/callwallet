import Vue from 'vue'
import App from './App.vue'
import store from './store/Index'
import router from './router/Index.js'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.prototype.$global = {islogin: false, offline: false, wallet: {}};

/// 注册监听token方法
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'token') {

      // 创建一个StorageEvent事件
      var newStorageEvent = document.createEvent('StorageEvent');
      const storage = {
          setItem: function (k, val) {
              sessionStorage.setItem(k, val);

              // 初始化创建的事件
              newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

              // 派发对象
              window.dispatchEvent(newStorageEvent)
          }
      }
      return storage.setItem(key, newVal);
  }
}



new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')



