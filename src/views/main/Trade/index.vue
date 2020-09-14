<template>
  <div class="trade">
    <v-container>
      <v-row class="box align-center">
        <div class="title ml-2">
          <h4>Trade Pair</h4>
        </div>
      </v-row>
      <v-row class="box align-center">
        <v-col cols="9">
          <v-combobox v-model="select" :items="items"></v-combobox>
        </v-col>
        <v-col class cols="2">
            <v-btn icon color="success">
                <v-icon>mdi-chart-line-variant</v-icon>
            </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <div class="cont">
            <v-row class="no-gutters mb-4">
              <v-col class="font-weight-bold">Price(CNY)</v-col>
              <v-col class="font-weight-bold text-right">Size(CALL)</v-col>
            </v-row>
            <v-virtual-scroll :items="table1.data" :item-height="30" height="200">
              <template v-slot="{item}">
                <v-row class="no-gutters">
                  <v-col class="text-left red--text">{{item.price}}</v-col>
                  <v-col class="text-right">{{item.size}}</v-col>
                </v-row>
              </template>
            </v-virtual-scroll>
            <v-divider></v-divider>
            <div class="text-h6 pa-2 d-flex align-center justify-center">
              <span class="green--text">0.1116</span>
              <v-icon class="green--text">mdi-arrow-up</v-icon>
            </div>
            <v-divider></v-divider>
            <v-virtual-scroll :items="table1.data" :item-height="30" height="200">
              <template v-slot="{item}">
                <v-row class="no-gutters">
                  <v-col class="text-left green--text">{{item.price}}</v-col>
                  <v-col class="text-right">{{item.size}}</v-col>
                </v-row>
              </template>
            </v-virtual-scroll>
          </div>
        </v-col>

        <v-col cols="7">
          <div class="cont pl-8">
            <h4>Trade</h4>
            <v-tabs style="width: 70%">
              <v-tab active-class="act-tab green--text">BUY</v-tab>
              <v-tab>SELL</v-tab>
              <!-- buy tab -->
              <v-tab-item>
                <div class="form mt-4" v-show="isShow1">
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Price</span>
                      <span class="h4">100 CNY available</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined></v-text-field>
                    </div>
                  </div>
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Amount</span>
                      <span class="h4">100 CNY available</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined></v-text-field>
                    </div>
                  </div>
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Total Value</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined></v-text-field>
                    </div>
                  </div>
                  <div class="form-item mb-2">
                    <v-slider
                      v-model="min"
                      min="0"
                      max="100"
                      label="Percent"
                      color="success"
                      track-color="#92cf94"
                    ></v-slider>
                  </div>
                  <v-btn block large color="#c91c46" class="success" @click="onBuy">BUY CALL</v-btn>
                </div>

                <div class="text-center" v-show="isShow2">
                  <div class="mt-8">You are about to create an order to buy</div>
                  <div class="text-h4 mt-8">10 CALL</div>
                  <div class="mt-8">for</div>
                  <div class="text-h4 mt-8">15.310 CNY</div>
                  <div class="mt-8">Are you sure?</div>
                  <div class="mt-16">
                    <v-btn class="mr-16" @click="onBack"><< Back</v-btn>
                    <v-btn class="primary" @click="onConfirm">Confirm</v-btn>
                  </div>
                </div>
                <div class="mt-8" v-show="isShow3">
                  <div class="pa-4 text-h5 success">Your order is now active!</div>
                  <v-divider class="mt-8"></v-divider>
                  <a class="d-flex mt-4" style="color: #5A83BB;" @click="onSub">Submit another order</a>
                </div>
              </v-tab-item>

              <!-- sell tab -->
              <v-tab-item>
                <div class="form mt-4" v-show="isShow4">
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Price</span>
                      <span class="h4">100 CNY available</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined></v-text-field>
                    </div>
                  </div>
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Amount</span>
                      <span class="h4">100 CNY available</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined></v-text-field>
                    </div>
                  </div>
                  <div class="form-item">
                    <div class="form-item-label d-flex justify-space-between mb-2">
                      <span class="h4">Total Value</span>
                    </div>
                    <div class="input">
                      <v-text-field dense outlined></v-text-field>
                    </div>
                  </div>
                  <div class="form-item mb-2">
                    <v-slider v-model="min" min="0" max="100" label="Min"></v-slider>
                  </div>
                  <v-btn block large color="#c91c46" class="white--text" @click="onBuy1">SELL CALL</v-btn>
                </div>

                <div class="text-center" v-show="isShow5">
                  <div class="mt-8">You are about to create an order to sell</div>
                  <div class="text-h4 mt-8">10 CALL</div>
                  <div class="mt-8">for</div>
                  <div class="text-h4 mt-8">15.310 CNY</div>
                  <div class="mt-8">Are you sure?</div>
                  <div class="mt-16">
                    <v-btn class="mr-16" @click="onBack1"><< Back</v-btn>
                    <v-btn class="primary" @click="onConfirm1">Confirm</v-btn>
                  </div>
                </div>

                <div class="mt-8" v-show="isShow6">
                  <div class="pa-4 text-h5 success">Your order is now active!</div>
                  <v-divider class="mt-8"></v-divider>
                  <a
                    class="d-flex mt-4"
                    style="color: #5A83BB;"
                    @click="onSub1"
                  >Submit another order</a>
                </div>
              </v-tab-item>
            </v-tabs>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="mt-6">
            <h4>Pending Orders</h4>
            <v-data-table
              :headers="table3.headers"
              :items="table3.data"
              :items-per-page="5"
              disable-sort
            >
              <template v-slot:item.Action="{ item }">
                <v-btn text dense color="error" @click="doCancel(item)">Cancel</v-btn>
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
export default {
  name: "trade",
  data() {
    const mockList = new Array(20).fill({ price: "0.16100", size: "24511.0" });
    const mockList2 = new Array(6).fill({
      Type: "Sell",
      Pair: "CALL/CNY@cBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf",
      Price: 0.2147,
      Amount: 100.0,
      Action: "Cancel",
    });
    return {
      select: ["CALL/CNY@cBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"],
      items: ["CALL/CNY@cBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf"],
      table1: {
        headers: [
          { text: "Price(CNY)", value: "price", align: "start" },
          {
            text: "Size(CALL)",
            value: "size",
            align: "end",
          },
        ],
        data: mockList,
      },
      table2: {
        headers: [
          { text: "Price(CNY)", value: "price", align: "start" },
          {
            text: "Size(CALL)",
            value: "size",
            align: "end",
          },
        ],
        data: mockList,
      },
      table3: {
        headers: [
          { text: "Type", value: "Type", align: "start" },
          {
            text: "Pair",
            value: "Pair",
            align: "start",
          },
          { text: "Price", value: "Price", align: "start" },
          { text: "Amount", value: "Amount", align: "start" },
          { text: "Action", value: "Action", align: "start" },
        ],
        data: mockList2,
      },
      min: 50,
      isShow1: true,
      isShow2: false,
      isShow3: false,
      isShow4: true,
      isShow5: false,
      isShow6: false,
    };
  },
  methods: {
    onBuy() {
      this.isShow1 = false;
      this.isShow2 = true;
    },
    onBack() {
      this.isShow2 = false;
      this.isShow1 = true;
    },

    onSub() {
      this.isShow3 = false;
      this.isShow1 = true;
    },
    onConfirm() {
      this.isShow2 = false;
      this.isShow3 = true;
      console.log(this.isShow2);
    },
    onBuy1() {
      this.isShow4 = false;
      this.isShow5 = true;
    },
    onBack1() {
      this.isShow5 = false;
      this.isShow4 = true;
    },

    onSub1() {
      this.isShow6 = false;
      this.isShow4 = true;
    },
    onConfirm1() {
      this.isShow5 = false;
      this.isShow6 = true;
    },

    doCancel(item) {
      console.dir(item);
      this.$toast.success("Cancel Success");
    },
  },
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
