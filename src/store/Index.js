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
        // update or add balance
        var item = state.balance_list[data.key];
        if (item)
        {
          item.value = Number(Number(item.value) + Number(data.change.value)) + '';
          state.balance_list[data.key] = item;
        }
        else
        {
          state.balance_list[data.key] = data.change;
        }

        if (data.key === 'CALL') {
          state.balance = state.balance_list['CALL'].value;
        }

        // update trustline balances
        var line = state.trustlines[data.key];
        if (line) {
          line.balance = Number((Number(line.balance) + Number(data.change.value))) + '';
          state.trustlines[data.key] = line;
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
      newTransaction(state, info) {
        state.transactions = [info].concat(state.transactions)
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
      updateTrustline(state, data) {
        var item = state.trustlines[data.key];
        if (item) {
          item.limit = data.change.limit;
          state.trustlines[data.key] = item;
          if (item.limit === '0') {
            var old = state.trustlines;
            delete old[data.key];
            state.trustlines = {};
            state.trustlines = old;
          }
        }
        else
        {
          var old = state.trustlines;
          old[data.key] = {
            currency: data.change.currency,
            counterparty: data.change.counterparty,
            limit: data.change.limit,
            balance: '0'
          };
          state.trustlines = {};
          state.trustlines = old;
        }
        console.log('updated lines');
        console.dir(state.trustlines);
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
