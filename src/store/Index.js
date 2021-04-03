import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import router from '../router/Index';
import utils from '../api/utils'

const store = new Vuex.Store({
    state: {
      api: new call.CallAPI({ server: 'wss://s1.callchain.live:5020' }),
      isLogin: false,
      isOffline: false,
      username: '',
      balance: 0,
      account_info: {},
      address: '',
      blob: {},
      height: 24997812,
      ledger: {"feePool":"8.719227","baseFeeCALL":"0.00001","ledgerHash":"9BCFEC2C391791822502ED52AD39F4CD1AF809203257281F5E8AAF842C7D5884","ledgerVersion":26621210,"ledgerTimestamp":"2020-09-28T10:01:32.000Z","reserveBaseCALL":"0.000001","reserveIncrementCALL":"0.000001","transactionCount":0,"validatedLedgerVersions":"11874029-26621210"},
      server: {host: 's1.callchain.live', port: '5020', ssl: true},
      balance_list: {},
      transactions: [],
      marker: {},
      trustlines: {},
      issue_list: {},
      pairs: ['CALL/CNY@c9GEywsWXZroNPmMgP1k4xjr7VRF6Gp4R7'],
      default_pair: 'CALL/CNY@c9GEywsWXZroNPmMgP1k4xjr7VRF6Gp4R7',
      currenct_pair: 'CALL/CNY@c9GEywsWXZroNPmMgP1k4xjr7VRF6Gp4R7',
      asks: {},
      bids: {},
      orders: {},
      price: 0,
      open_price: 0,
      change: 0
    },
    getters: {
      networkStatus(state) {
        return state.api.isConnected && state.api.isConnected()
      },
      reservedCall(state) {
        return utils.toFixed(Number(state.ledger.reserveBaseCALL) 
          + Number(state.account_info.ownerCount) * Number(state.ledger.reserveIncrementCALL));
      },
      askList(state) {
        var result = _.toPairs(state.asks);
        result = _.sortBy(result, function(o) {return -o[0]});
        return result;
      },
      bidList(state) {
        var result = _.toPairs(state.bids);
        result = _.sortBy(result, function(o) {return -o[0]});
        return result;
      },
      orderList(state) {
        var result = [];
        for (var seq in state.orders)
        {
          var order =  state.orders[seq];
          result.push(order);
        }
        result = _.sortBy(result, function(o) {return -o.seq});
        return result;
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
      updateHeight(state, ledger) {
        state.height = ledger.ledgerVersion
        state.ledger = ledger
      },
      newPair(state, pair) {
        state.pairs = state.pairs.concat(pair)
        state.currenct_pair = pair
      },
      resetPair(state) {
        state.currenct_pair = state.default_pair
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
      },

      initOrderbook(state, data) {
        // asks price use math.ceil, asks amount use math.ceil
        var i, s, price, amount, oa;
        var asks = {};
        var bids = {};
        for (i in data.asks) {
          s = data.asks[i].specification;
          price = utils.getPrice(s, 'sell');
          amount = utils.getAmount(s);
          oa = asks[price];
          asks[price] = oa ? utils.toFixed(Number(oa) + Number(amount)) : amount;
        }
        state.asks = asks;

        // bids price use math.floor, bids amount use math.ceil
        for (i in data.bids) {
          s = data.bids[i].specification;
          price = utils.getPrice(s, 'buy');
          amount = utils.getAmount(s);
          bids[price] = oa ? utils.toFixed(Number(oa) + Number(amount)) : amount;
        }
        state.bids = bids;
      },
      updateOrderbook(state, item) {
        var price = utils.getPrice(item, item.direction);
        var amount = utils.getAmount(item);
        var list = item.direction === 'buy' ? state.bids : state.asks;
        var total = list[price];
        if (item.status === 'created')
        {
          if (_.isEmpty(total)) {
            total = 0;
          }

          total = utils.toFixed(Number(total) + Number(amount));
          if (item.direction === 'buy')
            Vue.set(state.bids, price, total);
          else
            Vue.set(state.asks, price, total);
        }
        // filled, partially-filled, cancelled
        else
        {
          total = utils.toFixed(Number(total) - Number(amount));
          if (Number(total) === 0)
          {
            if (item.direction === 'buy')
              Vue.delete(state.bids, price);
            else
              Vue.delete(state.asks, price);
          }
          else
          {
            if (item.direction === 'buy')
              Vue.set(state.bids, price, total);
            else
              Vue.set(state.asks, price, total);
          }

          // new price
          if (item.status !== 'cancelled')
          {
            state.price = price;
            if (Number(state.open_price) === 0) state.open_price = price;
            state.change = ((Number(price) - Number(state.open_price)) * 100).toFixed(2);
          }
        }
      },

      initOrders(state, data) {
        var result = {};
        for (var i = 0; i < data.length; ++i)
        {
          var item = data[i];
          var spec = item.specification;
          result[item.properties.sequence] = {
            type: spec.direction,
            pair: utils.getPair(spec),
            price: utils.getPrice(spec, spec.direction),
            amount: utils.getAmount(spec),
            seq: item.properties.sequence
          }
        }
        state.orders = result;
      },
      updateOrder(state, data) {
        var order;
        if (data.status === 'created')
        {
          order = {
            type: data.direction,
            pair: utils.getPair(data),
            price: utils.getPrice(data, data.direction),
            amount: utils.getAmount(data),
            seq: data.sequence
          }
          Vue.set(state.orders, data.sequence, order);
        }
        else if (data.status === 'partially-filled')
        {
          order = state.orders[data.sequence];
          order.amount = utils.toFixed(Number(order.amount) - Number(utils.getAmount(data)));
          Vue.set(state.orders, data.sequence, order);
        }
        // filled, cancelled
        else
        {
          Vue.delete(state.orders, data.sequence);
        }
      },

      initPrice(state, data) {
        state.price = data.c;
        state.open_price = data.o;
        state.change = ((Number(state.price) - Number(state.open_price)) * 100).toFixed(2);
      },

      initAccountInfo(state, info) {
        state.account_info = info;
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
