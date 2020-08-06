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
      issue_list: [],
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
      },
      updateTransactions(state, result) {
        state.transactions = state.transactions.concat(result.results)
        state.marker = result.marker
      },
      initIssues(state, list) {
        var issues = [];
        for (var i = 0; i < list.lines.length; ++i) {
          var item = list.lines[i];
          issues.push({
            currency: item.Total.currency, 
            total: item.Total.value, 
            issued: item.Issued.value, 
            fans: item.Fans, 
            flags: item.Flags
          });
        }
        state.issue_list = issues;
      },

      initTrustlines(state, list) {
        var lines = [];
        for (var i = 0; i < list.results.length; ++i) {
          var item = list.results[i];
          lines.push({
            currency: item.specification.currency,
            counterparty: item.specification.counterparty,
            limit: item.specification.limit,
            balance: item.state.balance
          });
        }
        state.trustlines = lines;
        console.dir(state.trustlines)
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
