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
      blob: {},
      height: 24997812,
      server: {host: 's1.callchain.live', port: 5020, ssl: true},
      balance_list: [],
      transactions: [],
      marker: {},
      trustlines: [],
      issue_list: []
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
        state.height = height
      },
      initBalance(state, list) {
        state.balance_list = list
        for (var i = 0 ; i < list.length; ++i) {
          if (list[i].currency === 'CALL') {
            state.balance = list[i].value
            break
          }
        }
      },
      initTransactions(state, result) {
        state.transactions = result.results
        state.marker = result.marker
      }
    }
});

export default store
