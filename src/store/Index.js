import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      isLogin: false,
      isOffline: false,
      username: '',
      balance: 0,
      address: '',
      unfunded: false
    },
    mutations: {
      login (state) {
        state.isLogin = true
      },
      logout (state) {
        state.isLogin = false
      },
      offline (state) {
        state.isOffline = true
      },
      online (state) {
        state.isOffline = false
      }
    }
});

export default store
