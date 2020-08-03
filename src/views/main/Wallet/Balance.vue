<template>
    <v-card flat max-width="1085.21">
        <div class="d-flex align-center justify-start flex-wrap">
            <v-hover v-for="item in balance" :key="item.id" v-slot:default="{ hover }">
                <v-card width="30%" height="140" :elevation="hover ? 6 : 2" style="margin: 15px 1.66%;">
                    <v-card-title :class="hover?'pt-2 pb-2 pl-2 text-body-1 cardHover white--text':'pt-2 pb-2 pl-2 text-body-1 primary white--text'">{{item.currency}} - {{item.issuer}}</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 100px;" class="d-inline-flex flex-column justify-center">
                        <div class="text-h4 text-center">{{item.balance}}</div>
                        <div class="text-body-2 text-center">(reserv: {{item.reserve}})</div>
                    </v-card-text>
                </v-card>
            </v-hover>
        </div>
        <div class="font-weight-bold">Activity</div>
        <div>
            <v-data-table
                calculate-widths
                :headers="headers"
                :items="data"
                :items-per-page="5"
                hide-default-footer
            ></v-data-table>
            <v-divider></v-divider>
            <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center">Load More</v-btn>
        </div>
    </v-card>
</template>
<script>

import api from '../../../api/index';

export default {
    
    name: 'blance',
    data: () => ({
        headers: [{ text: 'Date', value: 'date', width: 200 }, { text: 'Event', value: 'content' }],
        balance: [
            { id: 1, currency: 'CALL', issuer: 'Callchain', balance: 0, reserve: 0.0001},
            { id: 2, currency: 'CNH', issuer: 'cEJNrFNcTA6BxiSY6TKvtx', balance: 100, reserve: 0}
        ],
        data: [
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
            { date: '10 minutes ago', content: 'You bought 3,934 CALL for 12,195 CNY. (price: 3.1). This order has been filled.' },
        ]
    }),
    async created() {
        var address = this.$store.state.address;
        console.log('get balance for address: ' + address);
        try {
            console.dir(this.$store.state);
            var height = this.$store.state.height;
            console.log(height);
            var ret = api.getBalances(address, {ledgerVersion: Number(height)});
            console.dir(ret);
        } catch (e) {
            console.dir(e);
        }
    },
    methods: {

    }
}
</script>