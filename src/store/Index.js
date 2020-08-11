import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import router from '../router/Index';

const store = new Vuex.Store({
    state: {
      api: new call.CallAPI({ server: 'wss://s1.callchain.live:5020' }),
      isLogin: false,
      isOffline: false,
      username: '',
      balance: 0,
      address: '',
      blob: {},
      height: 24997812,
      server: {host: 's1.callchain.live', port: '5020', ssl: true},
      balance_list: {},
      transactions: [],
      marker: {},
      trustlines: {},
      issue_list: {},
    },
    getters: {
      networkStatus(state) {
        return state.api.isConnected && state.api.isConnected()
      }
    },
    mutations: {
      login (state) {
        state.isLogin = true
        sessionStorage.setItem('islogin', true)
      },
      initApi(state, api) {
        state.api = api
      },
      logout (state) {
        state.isLogin = false
        sessionStorage.clear()
        router.push({name: 'login'})
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
        var result = {};
        for (var i = 0; i < list.length; ++i)
        {
          var item = list[i];
          var key = item.counterparty ? item.currency + '@' + item.counterparty : item.currency
          result[key] = item
        }
        state.balance_list = result

        // it must have call balance
        state.balance = state.balance_list['CALL'].value
      },
      updateBalance(state, data) {
        state.balance_list[data.key] = data.bal
        if (data.currency === 'CALL') {
          state.balance = data.bal.value
        }
      },

      initTransactions(state, result) {
        state.transactions = result.results
        state.marker = result.marker
      },
      updateTransactions(state, result) {
        state.transactions = state.transactions.concat(result.results)
        state.marker = result.marker
      },

      initIssues(state, list) {
        var issues = {};
        for (var i = 0; i < list.results.length; ++i) {
          var item = list.results[i];
          issues[item.specification.currency] = {
            currency: item.specification.currency,
            total: item.specification.value, 
            issued: item.state.issued, 
            fans: item.state.fans, 
            additional: item.specification.additional,
            invoice: item.specification.invoice
          };
        }
        state.issue_list = issues;
      },

      initTrustlines(state, list) {
        var result = {};
        for (var i = 0; i < list.results.length; ++i) {
          var item = list.results[i];
          var key = item.specification.currency + '@' + item.specification.counterparty;
          result[key] = {
            currency: item.specification.currency,
            counterparty: item.specification.counterparty,
            limit: item.specification.limit,
            balance: item.state.balance
          };
        }
        state.trustlines = result;
      },

      updateServer(state, server) {
        state.server = server;
      },

      newContact(state, item) {
        var contacts = state.blob.data.contacts
        contacts[item.title] = item.content
        state.blob.data.contacts = contacts
      },
      updateContact(state, msg) {
        if (msg.delBefIns) {
          delete state.blob.data.contacts[msg.oldtitle]
        }
        var contacts = state.blob.data.contacts
        contacts[item.title] = item.content
        state.blob.data.contacts = contacts
      }
    }
});

export default store
