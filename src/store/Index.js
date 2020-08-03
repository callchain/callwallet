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
      unfunded: false,
      blob: {},
      height: 24997812
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
      },
      setblob (state, msg) {
        state.blob = msg.blob
        state.username = msg.user
        state.address = msg.blob.data.account_id
      },
      updateHeight(state, height) {
        console.log('set new height=' + height);
        state.height = height
      }
    }
});

export default store
