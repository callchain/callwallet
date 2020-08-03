<template>
    <div class="main pa-8" style="min-height: 550px;">
        <NoData v-if="nofund"></NoData>
        <div v-if="!nofund">
            <div class="d-flex align-center justify-space-between mb-5">
                <span class="text-subtitle-1 font-weight-bold">Issue Token</span>
                <v-btn color="primary" @click="showStatus = 1" :disabled="showStatus == 0? false:true">New Issue</v-btn>
            </div>
            <v-divider></v-divider>
            <div v-if="showStatus == 0" class="mt-3 d-flex align-center flex-wrap">
                <v-hover v-for="item in 5" :key="item" v-slot:default="{ hover }">
                    <v-card @click="handleItemClick" width="24%" :elevation="hover ? 6 : 2" style="margin: 8px .5%">
                        <div :class="hover?'d-inline-flex justify-space-between pa-2 text-body-1 cardHover white--text':'d-inline-flex justify-space-between pa-2 text-body-1 primary white--text'" style="width: 100%;">
                            <span class="text-subtitle-1">asdY</span>
                            <span class="text-subtitle-1">23,000 Users</span>
                        </div>
                        <v-divider></v-divider>
                        <v-card-text class="text-center text-h6 pt-6 pb-6"><span class="primary--text">0.98</span>/<span>100,000</span></v-card-text>
                    </v-card>
                </v-hover>
            </div>

            <div class="mt-3" v-else-if="showStatus == 1">
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Symbol</p>
                    <v-text-field
                        outlined
                        v-model="symbol"
                        label="Symbol"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div>
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Total Supply</p>
                    <v-text-field
                        outlined
                        v-model="supply"
                        label="Total Supply"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div>
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Description</p>
                    <v-textarea
                        outlined
                        no-resize
                        rows="5"
                        name="description"
                        v-model="description"
                    ></v-textarea>
                </div>
                <v-checkbox
                    class="mt-0"
                    v-model="checkbox"
                    label="Non-Fungible Token"
                ></v-checkbox>
                <div class="">
                    <v-btn outlined color="primary" @click="showStatus = 0" width="100">back</v-btn>
                    <v-btn class="ml-5" color="primary" @click="showStatus = 0" width="180">comfirm</v-btn>
                </div>
            </div>

            <div v-else>
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Recipient</p>
                    <v-text-field
                        outlined
                        v-model="recipient"
                        label="Contract name or Callchain address"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div>
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Recipient will receive</p>
                    <div class="d-inline-flex">
                        <v-text-field
                            outlined
                            v-model="recipientReceive"
                            label="Recipient will receive"
                            solo
                            flat
                            dense
                        ></v-text-field>
                        <span class="mt-2 ml-5">USDT</span>
                    </div>
                </div>
                <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Invoice ID</p>
                    <v-text-field
                        outlined
                        v-model="invoiceID"
                        label="Invoice ID"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div>
                <div class="">
                    <v-btn outlined color="primary" @click="showStatus = 0" width="100">back</v-btn>
                    <v-btn class="ml-5" color="primary" @click="showStatus = 0" width="180">comfirm</v-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import NoData from '../../../components/NoData';

export default {
    name: 'receive',
    data: () => ({
        showStatus: 0, // 0 => list列表  1 => new新建  2 => new1新建 
        symbol: '',
        supply: '',
        description: '',
        checkbox: false, // 是否默认选中checkbox

        recipient: '',
        recipientReceive: '',
        invoiceID: ''

    }),
    methods: {
        // 新增
        handleNew() {
            this.showStatus = 1;
        },
        // 点击进入详情
        handleItemClick() {
            this.showStatus = 2;
        }
    },
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance === 0
        }
    },
}
</script>