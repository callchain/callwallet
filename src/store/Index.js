import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import router from '../router/Index';
import utils from '../api/utils'

import BN from "bignumber.js";
const ZERO = new BN(0);

const LEDGER_TMPL = {"feePool":"10.769998","baseFeeCALL":"0.001","ledgerHash":"80294B177352A4B99E0DEE0362F78AD759E0EAE53920FAFDB46004FCF2AE99F0","ledgerVersion":33428815,"ledgerTimestamp":"2021-05-23T00:44:41.000Z","reserveBaseCALL":"1","reserveIncrementCALL":"0.1","transactionCount":0,"validatedLedgerVersions":"11874029-33428815"};
const DEFAULT_SERVER = {host: 's1.callchain.live', port: '5020', ssl: true};
const DEFAULT_PAIR = 'CALL/USD@c9GEywsWXZroNPmMgP1k4xjr7VRF6Gp4R7';

const store = new Vuex.Store({
    state: {
      api: new call.CallAPI({ server: (DEFAULT_SERVER.ssl ? 'wss://' : 'ws://') +  DEFAULT_SERVER.host + ':' + DEFAULT_SERVER.port}),
      isLogin: false,
      isOffline: false,
      username: '',
      balance: ZERO,
      account_info: {},
      address: '',
      blob: {},
      height: LEDGER_TMPL.ledgerVersion,
      ledger: LEDGER_TMPL,
      server: DEFAULT_SERVER,
      balance_list: {},
      transactions: [],
      marker: {},
      trustlines: {},
      issue_list: {},
      pairs: [DEFAULT_PAIR],
      default_pair: DEFAULT_PAIR,
      current_pair: DEFAULT_PAIR,
      asks: {},
      bids: {},
      orders: {},
      price: ZERO,
      open_price: ZERO,
      change: ZERO
    },
    getters: {
      networkStatus(state) {
        return state.api.isConnected && state.api.isConnected();
      },
      // BN
      reservedCall(state) {
        return new BN(state.ledger.reserveIncrementCALL).times(state.account_info.ownerCount)
          .plus(state.ledger.reserveBaseCALL);
      },
      askList(state) {
        let result = _.toPairs(state.asks);
        result = _.sortBy(result, function(o) {return -o[0]});
        return result;
      },
      bidList(state) {
        let result = _.toPairs(state.bids);
        result = _.sortBy(result, function(o) {return -o[0]});
        return result;
      },
      orderList(state) {
        let result = [];
        for (let seq in state.orders)
        {
          let order =  state.orders[seq];
          result.push(order);
        }
        result = _.sortBy(result, function(o) {return -o.seq});
        return result;
      }
    },
    mutations: {
      login (state) {
        state.isLogin = true;
        sessionStorage.setItem('islogin', true);
      },
      initApi(state, api) {
        state.api = api;
      },
      logout (state) {
        state.isLogin = false;
        sessionStorage.clear();
        router.push({name: 'login'});
      },
      offline (state) {
        state.isOffline = true;
      },
      online (state) {
        state.isOffline = false;
      },
      setblob (state, msg) {
        state.blob = msg.blob;
        state.username = msg.user;
        state.address = msg.blob.data.account_id;
      },
      updateLedger(state, ledger) {
        state.ledger = ledger;
      },
      newPair(state, pair) {
        state.pairs = state.pairs.concat(pair);
        state.current_pair = pair;
      },
      resetPair(state) {
        state.current_pair = state.default_pair;
      },
      initBalance(state, list) {
        let result = {};
        for (let i = 0; i < list.length; ++i)
        {
          let item = list[i];
          let key = item.counterparty ? item.currency + '@' + item.counterparty : item.currency;
          result[key] = item;
          result[key].value = new BN(item.value);
        }
        state.balance_list = result;

        // it must have call balance
        state.balance = state.balance_list['CALL'].value;
      },
      updateBalance(state, data) {
        // update or add balance
        let item = state.balance_list[data.key];
        if (item)
        {
          item.value = item.value.plus(data.change.value);
          state.balance_list[data.key] = item;
        }
        else
        {
          state.balance_list[data.key] = new BN(data.change);
        }

        if (data.key === 'CALL') {
          state.balance =state.balance_list['CALL'].value;
        }

        // update trustline balances
        let line = state.trustlines[data.key];
        if (line) {
          line.balance = line.balance.plus(data.change.value);
          state.trustlines[data.key] = line;
        }
      },

      initTransactions(state, result) {
        state.transactions = result.results;
        state.marker = result.marker;
      },
      updateTransactions(state, result) {
        state.transactions = state.transactions.concat(result.results);
        state.marker = result.marker;
      },
      newTransaction(state, info) {
        state.transactions = [info].concat(state.transactions);
      },

      initIssues(state, list) {
        let issues = {};
        for (let i = 0; i < list.results.length; ++i) {
          let item = list.results[i];
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
        let result = {};
        for (let i = 0; i < list.results.length; ++i) {
          let item = list.results[i];
          let key = item.specification.currency + '@' + item.specification.counterparty;
          result[key] = {
            currency: item.specification.currency,
            counterparty: item.specification.counterparty,
            limit: new BN(item.specification.limit),
            balance: new BN(item.state.balance)
          };
        }
        state.trustlines = result;
      },
      updateTrustline(state, data) {
        let item = state.trustlines[data.key];
        if (item) {
          item.limit = new BN(data.change.limit);
          state.trustlines[data.key] = item;
          if (item.limit.isEqualTo(ZERO)) {
            let old = state.trustlines
            delete old[data.key]
            state.trustlines = {}
            state.trustlines = old
          }
        }
        else
        {
          let old = state.trustlines;
          old[data.key] = {
            currency: data.change.currency,
            counterparty: data.change.counterparty,
            limit: new BN(data.change.limit),
            balance: ZERO
          };
          state.trustlines = {};
          state.trustlines = old;
        }
      },

      initOrderbook(state, data) {
        let asks = {};
        let bids = {};
        for (let i in data.asks) {
          let s = data.asks[i].specification;
          let price = new BN(s.totalPrice.value).div(s.quantity.value);
          let amount = new BN(s.quantity.value);
          let oa = asks[price];
          asks[price] = oa ? oa.plus(amount) : amount;
        }
        state.asks = asks;

        // bids price use math.floor, bids amount use math.ceil
        for (let i in data.bids) {
          let s = data.bids[i].specification;
          let price = new BN(s.totalPrice.value).div(s.quantity.value);
          let amount = new BN(s.quantity.value);
          let ob = bids[price];
          bids[price] = ob ? ob.plus(amount) : amount;
        }
        state.bids = bids;
      },
      updateOrderbook(state, item) {
        let price = new BN(item.totalPrice.value).div(item.quantity.value);
        let amount = new BN(item.quantity.value);
        let list = item.direction === 'buy' ? state.bids : state.asks;
        let total = list[price];
        if (item.status === 'created')
        {
          if (_.isEmpty(total)) {
            total = ZERO;
          }

          total = total.plus(amount);
          if (item.direction === 'buy')
            Vue.set(state.bids, price, total);
          else
            Vue.set(state.asks, price, total);
        }
        // filled, partially-filled, cancelled
        else
        {
          total = total.minus(amount);
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
            if (state.open_price.isEqualTo(ZERO)) state.open_price = price;
            state.change = price.minus(state.open_price).times(100);
          }
        }
      },

      initOrders(state, data) {
        let result = {};
        for (let i = 0; i < data.length; ++i)
        {
          let item = data[i];
          let spec = item.specification;
          result[item.properties.sequence] = {
            type: spec.direction,
            pair: utils.getPair(spec),
            price: new BN(spec.totalPrice.value).div(spec.quantity.value),
            amount: new BN(spec.quantity.value),
            seq: item.properties.sequence
          }
        }
        state.orders = result;
      },
      updateOrder(state, data) {
        let order;
        if (data.status === 'created')
        {
          order = {
            type: data.direction,
            pair: utils.getPair(data),
            price: new BN(data.totalPrice.value).div(data.quantity.value),
            amount: new BN(data.quantity.value),
            seq: data.sequence
          }
          Vue.set(state.orders, data.sequence, order);
        }
        else if (data.status === 'partially-filled')
        {
          order = state.orders[data.sequence];
          order.amount = order.amount.minus(data.quantity.value);
          Vue.set(state.orders, data.sequence, order);
        }
        // filled, cancelled
        else
        {
          Vue.delete(state.orders, data.sequence);
        }
      },

      initPrice(state, data) {
        state.price = new BN(data.c);
        state.open_price = new BN(data.o);
        state.change = state.price.minus(state.open_price).times(100);
      },

      initAccountInfo(state, info) {
        state.account_info = info;
      },

      updateServer(state, server) {
        state.server = server;
      },

      newContact(state, item) {
        let contacts = state.blob.data.contacts;
        contacts[item.title] = item.content;
        state.blob.data.contacts = contacts;
      },
      updateContact(state, msg) {
        if (msg.delBefIns) {
          delete state.blob.data.contacts[msg.oldtitle];
        }
        let contacts = state.blob.data.contacts;
        contacts[msg.title] = msg.content;
        state.blob.data.contacts = contacts;
      }

    }
});

export default store
