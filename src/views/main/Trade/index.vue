<template>
  <div class="trade ma-4">
    <v-container>
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
            <v-btn icon color="success">
                <v-icon>mdi-chart-line-variant</v-icon>
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
                      <span class="h4">{{$t('trade.amount')}}</span>
                      <span class="h4">{{counterBalance}} {{counter.currency}} {{$t('trade.avail')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined  v-model="formAmount"></v-text-field>
                    </div>
                  </div>

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
                      <span class="h4">{{$t('trade.amount')}}</span>
                      <span class="h4">{{baseBalance}} {{base.currency}} {{$t('trade.avail')}}</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formAmount"></v-text-field>
                    </div>
                  </div>

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
              <template v-slot:item.Action="{ item }">
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
import utils from '../../../api/utils'
import i18n from './../../../plugins/i18n';


export default {
  name: "trade",
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
    emptyCurrency: {currency: '', counterparty: ''}
  }),
  computed: {
    pairs() {
      return this.$store.state.pairs
    },
    base() {
      return this.getBase();
    },
    counter() {
      var ret = this.getCounter();
      return ret;
    },
    price() {
      return this.$store.state.price;
    },
    change() {
      return this.$store.state.change;
    },
    asks() {
      console.log('update vue asks');
      var ret = this.$store.getters.askList;
      console.log('got asks');
      console.dir(ret);
      return ret;
    },
    bids() {
      console.log('update vue bids');
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
    this.selected = this.$store.state.currenct_pair;
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
    updatePercent() {
      if (Number(this.formPrice) === 0) return;
      if (this.type === 'buy')
      {
        var cb = this.getCounterBalance();
        var amnt = utils.toFixed(Number(cb) * Number(this.percent) / 100.0 / Number(this.formPrice));
        this.formAmount = amnt;
        this.formValue = utils.toFixed(Number(amnt) * Number(this.formPrice));
      }
      else
      {
        var bb = this.getBaseBalance();
        var amnt = utils.toFixed(Number(bb) * Number(this.percent) / 100.0);
        this.formAmount = amnt;
        this.formValue = utils.toFixed(Number(amnt) * Number(this.formPrice));
      }
    },
    changePair() {
      console.log('change pair ....');
      console.dir(this.selected);
      var _base = this.getBase();
      var _counter = this.getCounter();
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
    getBaseBalance() {
      var bal = this.$store.state.balance_list;
      var bc = this.getBase();
      var k = this.toString(bc);
      var b = bal[k];
      if (b) {
        if (b.currency === 'CALL') {
          var ret = utils.toFixed(Number(b.value) - Number(this.$store.getters.reservedCall));
          return ret;
        } else {
          return b.value;
        }
      }
      else return 0;
    },
    getCounterBalance() {
      var bal = this.$store.state.balance_list;
      var cc = this.getCounter();
      var k = this.toString(cc);
      var b = bal[k];
      if (b) {
        if (b.currency === 'CALL') {
          var ret = utils.toFixed(Number(b.value) - Number(this.$store.getters.reservedCall));
          return ret;
        } else {
          return b.value;
        }
      }
      else return 0;
    },
    checkCurrency(i) {
      var s = this.selected;
      var parts = s.split('/');
      if (parts.length !== 2) return this.emptyCurrency;
      var base = parts[i];
      if (base === 'CALL') return {currency: 'CALL', counterparty: ''};
      var bases = base.split('@');
      if (bases.length !== 2) return this.emptyCurrency;
      var currency = bases[0];
      if (!utils.isValidCur(currency)) return this.emptyCurrency;
      var counterparty = bases[1];
      if (!utils.isValidAddr(counterparty)) return this.emptyCurrency;

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
      var address = this.$store.state.address;
      var status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      var api = this.$store.state.api;
      var _base = this.getBase();
      var _counter = this.getCounter();
      if (this.isEmptyCurrency(_base) || this.isEmptyCurrency(_counter)) return;

      var ob = {
        base: _base,
        counter: _counter
      };
      if (ob.base.counterparty === '') delete ob.base.counterparty;
      if (ob.counter.counterparty === '') delete ob.counter.counterparty;

      try {
        var result = await api.getOrderbook(address, ob);
        console.log('---ob result---');
        console.dir(result);
        this.$store.commit('initOrderbook', result);
      } catch (e) {
        this.$toast.error(e.message);
        console.dir(e);
        if (e.message !== 'actNotFound') {
          this.$store.commit('logout');
        }
      }

    },
    async getPendingOrders() {
      var address = this.$store.state.address;
      var status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      var api = this.$store.state.api;

      try {
        var result = await api.getOrders(address);
        console.log('---pending order result---');
        console.dir(result);
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
      var address = this.$store.state.address;
      var blob = this.$store.state.blob;
      var secret = blob.data.master_seed;
      var status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      var api = this.$store.state.api;
      var _base = this.getBase();
      var _counter = this.getCounter();
      var order = {
        "direction": this.type,
        "quantity": {
          "currency": _base.currency,
          "counterparty": _base.counterparty,
          "value": this.formAmount
        },
        "totalPrice": {
          "currency": _counter.currency,
          "counterparty": _counter.counterparty,
          "value": this.formValue
        }
      };
      console.log('order info ...');
      console.dir(order);

      try {
        var prepare = await api.prepareOrder(address, order);
        prepare.secret = secret;
        console.log('prepare tx');
        console.dir(prepare);

        var signedTx = api.sign(prepare.txJSON, prepare.secret);
        var tx = await api.submit(signedTx, true);
        console.dir(tx);
        if (tx.resultCode !== 'tesSUCCESS')
        {
          this.$toast.error('Fail tansaction: ' + tx.resultCode);
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
      var sequence = item.seq;
      var address = this.$store.state.address;
      var blob = this.$store.state.blob;
      var secret = blob.data.master_seed;
      var status = this.$store.getters.networkStatus;
      if (!status) {
        this.$store.commit('logout');
        return;
      }

      var api = this.$store.state.api;
      try {
        var prepare = await api.prepareOrderCancellation(address, { orderSequence: Number(sequence) });
        prepare.secret = secret;
        var signedTx = api.sign(prepare.txJSON, prepare.secret);
        var tx = await api.submit(signedTx, true);
        console.dir(tx);
        if (tx.resultCode !== 'tesSUCCESS')
        {
          this.$toast.error('Fail tansaction: ' + tx.resultCode);
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
      if (isNaN(Number(newv))) {
        this.$nextTick(() => {
          this.formPrice = 0;
        });
        return;
      }
      if (Number(this.formPrice) === 0) return;

      if (Number(this.formAmount) !== 0)
      {
        this.$nextTick(() => {
          this.formValue = utils.toFixed(Number(this.formAmount)* Number(this.formPrice));
        });
      }
      else if (this.formValue !== 0)
      {
        this.$nextTick(() => {
          this.formAmount = utils.toFixed(Number(this.formValue) / Number(this.formPrice));
        });
      }

      this.formPrice = utils.toFixed(Number(this.formPrice));
    },
    formAmount(newv, oldv) {
      if (isNaN(Number(newv))) {
        this.$nextTick(() => {
          this.formPrice = 0;
        });
        return;
      }
      if (Number(this.formAmount) === 0) return;

      if (Number(this.formPrice) !== 0) {
        this.$nextTick(() => {
          this.formValue = utils.toFixed(Number(this.formAmount) * Number(this.formPrice));
        });
      }

      this.formAmount = utils.toFixed(Number(this.formAmount));
    },
    formValue(newv, oldV) {
      if (isNaN(Number(newv))) {
        this.$nextTick(() => {
          this.formPrice = 0;
        });
        return;
      }
      if (Number(this.formValue) === 0) return;

      if (Number(this.formPrice) !== 0) {
         this.$nextTick(() => {
          this.formAmount = utils.toFixed(Number(this.formValue) / Number(this.formPrice));
        });
      }

      this.formValue = utils.toFixed(Number(this.formValue));
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
