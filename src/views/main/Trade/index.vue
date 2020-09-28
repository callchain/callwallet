<template>
  <div class="trade ma-4">
    <v-container>
      <v-row class="box align-center">
        <div class="title ml-2">
          <span class="text-subtitle-1 font-weight-bold">Trade Pair</span>
        </div>
      </v-row>

      <!-- pair select -->
      <v-row class="box align-center">
        <v-col cols="9">
          <v-combobox v-model="selected" :items="pairs"></v-combobox>
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
              <v-col class="font-weight-bold">Price({{counter.currency}})</v-col>
              <v-col class="font-weight-bold text-right">Size({{base.currency}})</v-col>
            </v-row>

            <!-- asks -->
            <v-virtual-scroll :items="asks" :item-height="30" height="200">
              <template v-slot="{item}">
                <v-row class="no-gutters">
                  <v-col class="text-left red--text">{{item[0]}}</v-col>
                  <v-col class="text-right">{{item[1]}}</v-col>
                </v-row>
              </template>
            </v-virtual-scroll>

            <v-divider></v-divider>
            <div class="text-h6 pa-2 d-flex align-center justify-center">
              <span class="green--text">{{price}}</span>
              <v-icon class="green--text" v-if="change > 0">mdi-arrow-up</v-icon>
              <v-icon class="red--text" v-else-if="change < 0">mdi-arrow-down</v-icon>
            </div>
            <v-divider></v-divider>
            
            <!-- bids -->
            <v-virtual-scroll :items="bids" :item-height="30" height="200">
              <template v-slot="{item}">
                <v-row class="no-gutters">
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
            <h4>Trade</h4>
            <v-tabs style="width: 70%">
              <v-tab active-class="act-tab green--text" @click="toForm('buy')">BUY</v-tab>
              <v-tab @click="toForm('sell')">SELL</v-tab>
              <!-- buy tab -->
              <v-tab-item>
                <!-- buy form -->
                <div class="form mt-4" v-show="showForm">
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Amount</span>
                      <span class="h4">{{counterBalance}} {{counter.currency}} available</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined  v-model="formAmount"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Price</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formPrice"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Total Value</span>
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
                      label="Percent"
                      color="success"
                      track-color="#92cf94"
                      @end="updatePercent()"
                      thumb-label
                    ></v-slider>
                  </div>

                  <v-btn block large color="#c91c46" class="success" @click="toConfirm()">BUY {{base.currency}}</v-btn>
                </div>

                <!-- buy confirm -->
                <div class="text-center" v-show="showConfirm">
                  <div class="mt-8">You are about to create an order to buy</div>
                  <div class="text-h4 mt-8">{{formAmount}} {{base.currency}}</div>
                  <div class="mt-8">for</div>
                  <div class="text-h4 mt-8">{{formValue}} {{counter.currency}}</div>
                  <div class="mt-8">Are you sure?</div>
                  <div class="mt-16">
                    <v-btn class="mr-16" @click="toForm()">&lt;&lt; Back</v-btn>
                    <v-btn class="primary" @click="createOrder()">Confirm</v-btn>
                  </div>
                </div>

                <!-- buy result -->
                <div class="mt-8" v-show="showResult">
                  <div class="pa-4 text-h5 success">Your order is now active!</div>
                  <v-divider class="mt-8"></v-divider>
                  <a class="d-flex mt-4" style="color: #5A83BB;" @click="toForm()">Submit another order</a>
                </div>
              </v-tab-item>

              <!-- sell tab -->
              <v-tab-item>
                <!-- sell form -->
                <div class="form mt-4" v-show="showForm">
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Amount</span>
                      <span class="h4">{{baseBalance}} {{base.currency}} available</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formAmount"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Price</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formPrice"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Total Value</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined v-model="formValue"></v-text-field>
                    </div>
                  </div>

                  <div class="form-item mb-2">
                    <v-slider v-model="percent" min="0" max="100" label="Percent" thumb-label @end="updatePercent()"></v-slider>
                  </div>

                  <v-btn block large color="#c91c46" class="white--text" @click="toConfirm()">SELL {{base.currency}}</v-btn>
                </div>

                 <!-- sell confirm -->
                <div class="text-center" v-show="showConfirm">
                  <div class="mt-8">You are about to create an order to sell</div>
                  <div class="text-h4 mt-8">{{formAmount}} {{base.currency}}</div>
                  <div class="mt-8">for</div>
                  <div class="text-h4 mt-8">{{formValue}} {{counter.currency}}</div>
                  <div class="mt-8">Are you sure?</div>
                  <div class="mt-16">
                    <v-btn class="mr-16" @click="toForm()">&lt;&lt; Back</v-btn>
                    <v-btn class="primary" @click="createOrder()">Confirm</v-btn>
                  </div>
                </div>

                <!-- sell result -->
                <div class="mt-8" v-show="showResult">
                  <div class="pa-4 text-h5 success">Your order is now active!</div>
                  <v-divider class="mt-8"></v-divider>
                  <a
                    class="d-flex mt-4"
                    style="color: #5A83BB;"
                    @click="toForm()"
                  >Submit another order</a>
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
            <h4>Pending Orders</h4>
            <v-data-table
              :headers="orders.headers"
              :items="orderData"
              :items-per-page="5"
              disable-sort
            >
              <template v-slot:item.specification.quantity="{ item }">
                {{item | orderPair}}
              </template>
              <template v-slot:item.specification.totalPrice="{ item }">
                {{item | orderPrice}}
              </template>
              <template v-slot:item.Action="{ item }">
                <v-btn text dense color="error" @click="cancelOrder(item)">Cancel</v-btn>
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

export default {
  name: "trade",
  data: () => ({
    selected: 'CALL/CNY@cEJNrFNcTA6BxiSY6TKvtxT7Kg7vrVq9hz',
    price: '0',
    change: 0,

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
        { text: "Type", value: "specification.direction", align: "start" },
        {
          text: "Pair",
          value: "specification.quantity",
          align: "start",
        },
        { text: "Price", value: "specification.totalPrice", align: "start" },
        { text: "Amount", value: "specification.quantity.value", align: "start" },
        { text: "Action", value: "Action", align: "start" },
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
    asks() {
      var ob = this.$store.state.ob.asks;
      var result = _.toPairs(ob);
      console.log('in ask');
      console.dir(result);
      result = _.sortBy(result, function(o) {return o[0]});
      console.dir(result);
      return result;
    },
    bids() {
      var ob = this.$store.state.ob.bids;
      var result = _.toPairs(ob);
      console.log('in bid');
      console.dir(result);
      result = _.sortBy(result, function(o) {return -o[0]});
      console.dir(result);
      return result;
    },
    orderData() {
      return this.$store.state.orders;
    },
    baseBalance() {
      return this.getBaseBalance();
    },
    counterBalance() {
      return this.getCounterBalance();
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.getOrderbook();
      this.getPendingOrders();
    },
    updatePercent() {
      console.dir(this.percent);
      if (Number(this.formPrice) === 0) return;
      if (this.type === 'buy')
      {
        var cb = this.getCounterBalance();
        var amnt = (Number(cb) * Number(this.percent) / Number(this.formPrice)).toFixed(6);
        this.formAmount = amnt;
        this.formValue = (Number(amnt) * Number(this.formPrice)).toFixed(6);
      }
      else
      {
        var bb = this.getBaseBalance();
        var amnt = (Number(bb) * Number(this.percent)).toFixed(6);
        this.formAmount = amnt;
        this.formValue = (Number(amnt) * Number(this.formPrice)).toFixed(6);
      }
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
      if (b) return b.value;
      else return 0;
    },
    getCounterBalance() {
      var bal = this.$store.state.balance_list;
      var cc = this.getCounter();
      var k = this.toString(cc);
      var b = bal[k];
      if (b) return b.value;
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
      if (t) {
        this.type = t;
        this.formPrice = 0;
        this.formAmount = 0;
        this.formValue = 0;
        this.percent = 0;
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

      try {
        var prepare = await api.prepareOrder(address, order);
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
      var sequence = item.properties.sequence;
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
          this.formValue = (Number(this.formAmount)* Number(this.formPrice)).toFixed(6);
        });
      }
      else if (this.formValue !== 0)
      {
        this.$nextTick(() => {
          this.formAmount = (Number(this.formValue) / Number(this.formPrice)).toFixed(6);
        });
      }

      this.formPrice = Number(this.formPrice).toFixed(6);
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
          this.formValue = (Number(this.formAmount) * Number(this.formPrice)).toFixed(6);
        });
      }

      this.formAmount = Number(this.formAmount).toFixed(6);
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
          this.formAmount = (Number(this.formValue) / Number(this.formPrice)).toFixed(6);
        });
      }

      this.formValue = Number(this.formValue).toFixed(6);
    }
  }
};
</script>

<style scoped>
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
</style>
