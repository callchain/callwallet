<template>
  <div class="trade ma-4">
    <NoData v-if="nofund"></NoData>
    <v-container v-if="!nofund">
      <v-row class="box align-center">
        <div class="title ml-2">
          <span class="text-subtitle-1 font-weight-bold">{{$t('trade.pair')}}</span>
        </div>
      </v-row>

      <!-- pair select -->
      <v-row class="box align-center">
        <v-col cols="9">
          <v-combobox v-model="selected" :items="pairs" @change="changePair()"></v-combobox>
        </v-col>
        <v-col class cols="2">
            <v-btn icon color="success" @click="goToKline">
                <!-- KLINE -->
                <v-icon>mdi-chart-line</v-icon>
            </v-btn>
        </v-col>
      </v-row>

      
      <v-row>
        <!-- orderbook -->
        <v-col cols="4">
          <div class="cont">
            <v-row class="no-gutters mb-4">
              <v-col class="font-weight-bold">{{$t('trade.price')}}({{counter.currency}})</v-col>
              <v-col class="font-weight-bold text-right">{{$t('trade.size')}}({{base.currency}})</v-col>
            </v-row>

            <div class="scroll-box d-flex flex-column justify-end" style="height: 200px;">
              <!-- asks -->
              <v-virtual-scroll class="scroll-custom" :items="asks" :item-height="30" max-height="200px">
                <template v-slot="{item}">
                  <v-row class="no-gutters priceline" @click="getObPrice(item)">
                    <v-col class="text-left red--text">{{item[0]}}</v-col>
                    <v-col class="text-right">{{item[1]}}</v-col>
                  </v-row>
                </template>
              </v-virtual-scroll>
            </div>

            <v-divider></v-divider>
            <div class="text-h6 pa-2 d-flex align-center justify-center">
              <span class="green--text" v-if="change > 0">{{price}}</span>
              <span class="red--text" v-else-if="change < 0">{{price}}</span>
              <span class="grey--text" v-else>{{price}}</span>


              <v-icon class="green--text" v-if="change > 0">mdi-arrow-up</v-icon>
              <v-icon class="red--text" v-else-if="change < 0">mdi-arrow-down</v-icon>
            </div>
            <v-divider></v-divider>
            
            <!-- bids -->
            <v-virtual-scroll :items="bids" :item-height="30" height="200">
              <template v-slot="{item}">
                <v-row class="no-gutters priceline" @click="getObPrice(item)">
                  <v-col class="text-left green--text">{{item[0]}}</v-col>
                  <v-col class="text-right">{{item[1]}}</v-col>
                </v-row>
              </template>
            </v-virtual-scroll>
          </div>
        </v-col>

        <!-- trade panel -->
        <v-col cols="7">
          <div class="cont pl-8">
            <h4>{{$t('trade.trade')}}</h4>
            <v-tabs style="width: 70%">
              <v-tab active-class="act-tab green--text" @click="toForm('buy')">{{$t('trade.buy')}}</v-tab>
              <v-tab @click="toForm('sell')">{{$t('trade.sell')}}</v-tab>
              <!-- buy tab -->
              <v-tab-item>
                <!-- buy form -->
                <div class="form mt-4" v-show="showForm">
                  
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">{{$t('trade.price')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formPrice"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">{{$t('trade.amount')}}</span>
                      <span class="h4">{{counterBalance}} {{counter.currency}} {{$t('trade.avail')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined  v-model="formAmount"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">{{$t('trade.value')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formValue"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item mb-2">
                    <v-slider
                      v-model="percent"
                      min="0"
                      max="100"
                      :label="$t('trade.percent')"
                      color="success"
                      track-color="#92cf94"
                      @end="updatePercent()"
                      @click="updatePercent()"
                      thumb-label
                      step="25"
                      :tick-labels="['0%','25%','50%','75%', '100%']"
                      tick-size="1"
                    ></v-slider>
                  </div>

                  <v-btn block large color="#c91c46" class="success" @click="toConfirm()">{{$t('trade.buy')}} {{base.currency}}</v-btn>
                </div>

                <!-- buy confirm -->
                <div class="text-center" v-show="showConfirm">
                  <div class="mt-8">{{$t('trade.tobuy')}}</div>
                  <div class="text-h4 mt-8">{{formAmount}} {{base.currency}}</div>
                  <div class="mt-8">{{$t('trade.for')}}</div>
                  <div class="text-h4 mt-8">{{formValue}} {{counter.currency}}</div>
                  <div class="mt-8">{{$t('trade.sure')}}</div>
                  <div class="mt-16">
                    <v-btn class="mr-16" @click="toForm()">&lt;&lt; {{$t('trade.back')}}</v-btn>
                    <v-btn class="primary" @click="createOrder()">{{$t('trade.confirm')}}</v-btn>
                  </div>
                </div>

                <!-- buy result -->
                <div class="mt-8" v-show="showResult">
                  <div class="pa-4 text-h5 success">{{$t('trade.active')}}</div>
                  <v-divider class="mt-8"></v-divider>
                  <a class="d-flex mt-4" style="color: #5A83BB;" @click="toForm()">{{$t('trade.another')}}</a>
                </div>
              </v-tab-item>

              <!-- sell tab -->
              <v-tab-item>
                <!-- sell form -->
                <div class="form mt-4" v-show="showForm">

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">{{$t('trade.price')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formPrice"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">{{$t('trade.amount')}}</span>
                      <span class="h4">{{baseBalance}} {{base.currency}} {{$t('trade.avail')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formAmount"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">{{$t('trade.value')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formValue"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item mb-2">
                    <v-slider 
                      v-model="percent" min="0" max="100" :label="$t('trade.percent')" thumb-label @end="updatePercent()"
                      @click="updatePercent()"
                      step="25"
                      :tick-labels="['0%','25%','50%','75%', '100%']"
                      tick-size="1"
                      ></v-slider>
                  </div>

                  <v-btn block large color="#c91c46" class="white--text" @click="toConfirm()">{{$t('trade.sell')}} {{base.currency}}</v-btn>
                </div>

                 <!-- sell confirm -->
                <div class="text-center" v-show="showConfirm">
                  <div class="mt-8">{{$t('trade.tosell')}}</div>
                  <div class="text-h4 mt-8">{{formAmount}} {{base.currency}}</div>
                  <div class="mt-8">for</div>
                  <div class="text-h4 mt-8">{{formValue}} {{counter.currency}}</div>
                  <div class="mt-8">{{$t('trade.sure')}}</div>
                  <div class="mt-16">
                    <v-btn class="mr-16" @click="toForm()">&lt;&lt; {{$t('trade.back')}}</v-btn>
                    <v-btn class="primary" @click="createOrder()">{{$t('trade.confirm')}}</v-btn>
                  </div>
                </div>

                <!-- sell result -->
                <div class="mt-8" v-show="showResult">
                  <div class="pa-4 text-h5 success">{{$t('trade.active')}}</div>
                  <v-divider class="mt-8"></v-divider>
                  <a
                    class="d-flex mt-4"
                    style="color: #5A83BB;"
                    @click="toForm()"
                  >{{$t('trade.another')}}</a>
                </div>
              </v-tab-item>
            </v-tabs>
          </div>
        </v-col>
      </v-row>

      <!-- pending orders -->
      <v-row>
        <v-col cols="12">
          <div class="mt-6">
            <h4>{{$t('trade.pending')}}</h4>
            <v-data-table
              :headers="orders.headers"
              :items="orderData"
              :items-per-page="5"
              disable-sort
            >
              <template v-slot:[`item.Action`]="{ item }">
                <v-btn text dense color="error" @click="cancelOrder(item)">{{$t('trade.cancel')}}</v-btn>
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import BN from 'bignumber.js';
const ZERO = new BN(0);

import NoData from '../../../components/NoData';
import utils from '../../../api/utils';
import i18n from './../../../plugins/i18n';
import axios from 'axios';

const EMPTY_CURRENCY = {currency: '', counterparty: ''};

export default {
  name: "Trade",
  data: () => ({
    selected: '',

    showForm: true,
    showConfirm: false,
    showResult: false,
    formPrice: 0,
    formAmount: 0,
    formValue: 0,

    type: 'buy',

    orders: {
      headers: 
      [
        { text: i18n.tc('trade.type'), value: "type", align: "start" },
        {
          text: i18n.tc('trade.pair'),
          value: "pair",
          align: "start",
        },
        { text: i18n.tc('trade.price'), value: "price", align: "start" },
        { text: i18n.tc('trade.amount'), value: "amount", align: "start" },
        { text: i18n.tc('trade.action'), value: "Action", align: "start" },
      ],
    },
    percent: 0,
    noBubble: false
  }),
  components: {
    NoData
  },
  computed: {
    nofund() {
      return this.$store.state.balance.isEqualTo(ZERO);
    },
    pairs() {
      return this.$store.state.pairs
    },
    base() {
      return this.getBase();
    },
    counter() {
      return this.getCounter();
    },
    price() {
      return this.$store.state.price;
    },
    change() {
      return this.$store.state.change;
    },
    asks() {
      return this.$store.getters.askList;
    },
    bids() {
      return this.$store.getters.bidList;
    },
    orderData() {
      return this.$store.getters.orderList;
    },
    baseBalance() {
      return this.getBaseBalance();
    },
    counterBalance() {
      return this.getCounterBalance();
    }
  },
  created() {
    this.selected = this.$store.state.current_pair;
    this.initData();
    this.getPendingOrders();
  },
  methods: {
    initData() {
      this.getOrderbook();
    },
    getObPrice(item) {
      this.formPrice = item[0];
    },
    goToKline() {
      window.open('https://data.callchain.cc', '_blank');
    },
    updatePercent() {
      let bp = new BN(this.formPrice);
      if (bp.isEqualTo(ZERO)) return;

      if (this.type === 'buy')
      {
        let cb = this.getCounterBalance();
        let amnt = cb.times(this.percent).div(100).div(bp);
        this.formAmount = amnt.toNumber()
        this.formValue = amnt.times(bp).toNumber();
      }
      else
      {
        let bb = this.getBaseBalance();
        let amnt = bb.times(this.percent).div(100);
        this.formAmount = amnt.toNumber();
        this.formValue = amnt.times(bp);
      }
    },
    changePair() {
      let _base = this.getBase();
      let _counter = this.getCounter();
      if (this.isEmptyCurrency(_base) || this.isEmptyCurrency(_counter))
      {
        this.$toast.error('Invalid Trade Pair');
        this.selected = this.$store.state.default_pair;
        this.$store.commit('resetPair');
      }
      else
      {
        this.$store.commit('newPair', this.selected);
      }
      this.initData();
    },
    toString(cur) {
      if (cur.currency === 'CALL') return 'CALL';
      return cur.currency  + '@' + cur.counterparty;
    },
    // return BN
    getBaseBalance() {
      let bal = this.$store.state.balance_list;
      let bc = this.getBase();
      let k = this.toString(bc);
      let b = bal[k];
      if (b) {
        return b.currency === 'CALL' 
            ? b.value.minus(this.$store.getters.reservedCall) : b.value;
      }
      else return ZERO;
    },
    // return BN
    getCounterBalance() {
      let bal = this.$store.state.balance_list;
      let cc = this.getCounter();
      let k = this.toString(cc);
      let b = bal[k];
      if (b) {
        return b.currency === 'CALL' 
            ? b.value.minus(this.$store.getters.reservedCall) : b.value;
      }
      else return ZERO;
    },
    checkCurrency(i) {
      let s = this.selected;
      let parts = s.split('/');
      if (parts.length !== 2) return EMPTY_CURRENCY;
      let base = parts[i];
      if (base === 'CALL') return {currency: 'CALL', counterparty: ''};
      let bases = base.split('@');
      if (bases.length !== 2) return EMPTY_CURRENCY;
      let currency = bases[0];
      if (!utils.isValidCur(currency)) return EMPTY_CURRENCY;
      let counterparty = bases[1];
      if (!utils.isValidAddr(counterparty)) return EMPTY_CURRENCY;

      return {currency: currency, counterparty: counterparty};
    },
    getBase() {
      return this.checkCurrency(0);
    },
    getCounter() {
      return this.checkCurrency(1);      
    },

    toConfirm() {
      this.showForm = false;
      this.showConfirm = true;
      this.showResult = false;
    },
    toForm(t) {
      this.showForm = true;
      this.showResult = false;
      this.showConfirm = false;
      // if (t) {
        // this.type = t;
        this.formPrice = 0;
        this.formAmount = 0;
        this.formValue = 0;
        this.percent = 0;
      // }
      if (t) {
        this.type = t;
      }
    },
    isEmptyCurrency(item) {
      if (item.currency === '') return true;
    },
    async getOrderbook() {
      let address = this.$store.state.address;
      let status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      // get orderbook
      let api = this.$store.state.api;
      let _base = this.getBase();
      let _counter = this.getCounter();
      if (this.isEmptyCurrency(_base) || this.isEmptyCurrency(_counter)) return;

      let ob = {
        base: _base,
        counter: _counter
      };
      if (ob.base.counterparty === '') delete ob.base.counterparty;
      if (ob.counter.counterparty === '') delete ob.counter.counterparty;

      try {
        let result = await api.getOrderbook(address, ob);
        this.$store.commit('initOrderbook', result);
      } catch (e) {
        this.$toast.error(e.message);
        console.dir(e);
        if (e.message !== 'actNotFound') {
          this.$store.commit('logout');
        }
      }

      // get orderbook price
      let the_pair = this.selected;
      the_pair = the_pair.replace('/', '_');
      try {
        let ret = await axios.get("https://data.callchain.cc/price/latest/" + the_pair);
        this.$store.commit('initPrice', ret.data.data);
      } catch (e) {
        console.error(e);
      }

    },
    async getPendingOrders() {
      let address = this.$store.state.address;
      let status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      let api = this.$store.state.api;

      try {
        let result = await api.getOrders(address);
        this.$store.commit('initOrders', result.results);
      } catch (e) {
        this.$toast.error(e.message);
        console.dir(e);
        if (e.message !== 'actNotFound') {
          this.$store.commit('logout');
        }
      }
    },
    async createOrder() {
      let address = this.$store.state.address;
      let blob = this.$store.state.blob;
      let secret = blob.data.master_seed;
      let status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      // check balance
      if (this.type === 'buy')
      {
        let cb = this.getCounterBalance();
        if (cb.isLessThan(this.formValue)) {
          this.$toast.error('Counter balance not enough');
          return;
        }
      }
      else
      {
        let bb = this.getBaseBalance();
        if (bb.isLessThan(this.formAmount)) {
          this.$toast.error('Base balance not enough');
          return;
        }
      }

      let api = this.$store.state.api;
      let _base = this.getBase();
      let _counter = this.getCounter();
      let order = {
        'direction': this.type,
        'quantity': {
          'currency': _base.currency,
          'counterparty': _base.counterparty,
          'value': this.formAmount
        },
        'totalPrice': {
          'currency': _counter.currency,
          'counterparty': _counter.counterparty,
          'value': this.formValue
        }
      };

      try {
        let prepare = await api.prepareOrder(address, order);
        prepare.secret = secret;

        let signedTx = api.sign(prepare.txJSON, prepare.secret);
        let tx = await api.submit(signedTx, true);
        if (tx.resultCode !== 'tesSUCCESS')
        {
          this.$toast.error('Fail transaction: ' + tx.resultCode);
        }
        else
        {
          this.showConfirm = false;
          this.showResult = true;
          this.showForm = false;
          this.$toast.success('The transaction was applied. Only final in a validated ledger');
        }
      } catch (e) {
        this.$toast.error(e.message);
        console.dir(e);
        if (e.message !== 'actNotFound') {
          this.$store.commit('logout');
        }
      }
    },
    async cancelOrder(item) {
      let sequence = item.seq;
      let address = this.$store.state.address;
      let blob = this.$store.state.blob;
      let secret = blob.data.master_seed;
      let status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      let api = this.$store.state.api;
      try {
        let prepare = await api.prepareOrderCancellation(address, { orderSequence: Number(sequence) });
        prepare.secret = secret;
        let signedTx = api.sign(prepare.txJSON, prepare.secret);
        let tx = await api.submit(signedTx, true);
        if (tx.resultCode !== 'tesSUCCESS')
        {
          this.$toast.error('Fail transaction: ' + tx.resultCode);
        }
        else
        {
          this.$toast.success('The transaction was applied. Only final in a validated ledger');
        }
      } catch (e) {
        this.$toast.error(e.message);
        console.dir(e);
        if (e.message !== 'actNotFound') {
          this.$store.commit('logout');
        }
      }
    }

  },
  watch: {
    formPrice(newv, oldv) {
      if (this.noBubble) {
        this.noBubble = !this.noBubble;
        return;
      }

      if (isNaN(newv)) {
        this.$nextTick(() => {
          this.formPrice = 0;
        });
        return;
      }
      let bp = new BN(this.formPrice);
      let ba = new BN(this.formAmount);
      let bv = new BN(this.formValue);

      if (bp.isEqualTo(ZERO)) return;

      this.$nextTick(() => {
        this.formPrice = (this.formPrice + '').match(/^\d+(?:\.\d{0,6})?/)[0];
      });

      if (!ba.isEqualTo(ZERO))
      {
        this.$nextTick(() => {
          this.formValue = ba.times(bp).toNumber();
        });
      }
      else if (!bv.isEqualTo(ZERO))
      {
        this.$nextTick(() => {
          this.formAmount = bv.div(bp).toNumber();
        });
      }
    },
    formAmount(newv, oldv) {
      if (this.noBubble) {
        this.noBubble = !this.noBubble;
        return;
      }

      if (isNaN(newv)) {
        this.$nextTick(() => {
          this.formPrice = 0;
        });
        return;
      }
      let ba = new BN(this.formAmount);
      let bp = new BN(this.formPrice);
      if (ba.isEqualTo(ZERO)) return;

      if (!bp.isEqualTo(ZERO)) {
        this.$nextTick(() => {
          this.formValue = ba.times(bp).toNumber();
        });
      }
    },
    formValue(newv, oldV) {
      if (this.noBubble) {
        this.noBubble = !this.noBubble;
        return;
      }

      if (isNaN(newv)) {
        this.$nextTick(() => {
          this.formPrice = 0;
        });
        return;
      }
      let bv = new BN(this.formValue);
      let bp = new BN(this.formPrice);

      if (bv.isEqualTo(ZERO)) return;

      if (!bp.isEqualTo(ZERO)) {
         this.$nextTick(() => {
           this.formAmount = bv.div(bp).toNumber();
           this.noBubble = true;
        });
      }
    }
  }
};
</script>

<style lang="less">
  .trade {
    .act-tab::after {
      background-color: #4caf50;
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      z-index: 999;
    }
    .scroll-custom {
      // height: auto;
      // flex: 0 1 auto;
    }
    .priceline {
      cursor: pointer;
    }
  }

</style>
