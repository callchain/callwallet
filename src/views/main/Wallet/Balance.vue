<template>
    <v-card flat max-width="1085.21">
        <NoData v-if="nofund"></NoData>
        <div v-if="!nofund">
        <div class="d-flex align-center justify-start flex-wrap">
            <v-hover v-for="item in balance" :key="item.id" v-slot:default="{ hover }">
                <v-card width="32.3%" height="140" :elevation="hover ? 6 : 2" style="margin: 5px 0.5%;">
                    <v-card-title :class="hover?'pt-2 pb-2 pl-2 text-body-2 cardHover white--text':'pt-2 pb-2 pl-2 text-body-2 primary white--text'">{{item.currency}}@{{item.counterparty ? item.counterparty : 'Callchain'}}</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 100px;" class="d-inline-flex flex-column justify-center">
                        <div class="text-h4 text-center">{{item.value.toFormat()}}</div>
                        <div class="text-body-2 text-center" v-if="item.currency === 'CALL'">({{$t('wallet.balance.reserve')}}: {{reserved}})</div>
                    </v-card-text>
                </v-card>
            </v-hover>
        </div>
        <div class="font-weight-bold" style="margin-top: 20px;">{{$t('wallet.balance.activity')}}</div>
        <div>
            <v-data-table
                calculate-widths
                :headers="headers"
                :items="transactions"
                :items-per-page="10"
                :item-class="rowClass"
                disable-sort
                hide-default-footer
            >
                <template v-slot:[`item.content`]="{item}">
                    <a :href="'http://block.callchain.cc/#/transaction/' + item.id" target="_blank">{{item.content}}</a>
                </template>
            </v-data-table>
            <v-divider></v-divider>
            <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center">{{$t('wallet.balance.history')}}</v-btn>
        </div>
        </div>
    </v-card>
</template>
<script>

import BN from 'bignumber.js';
const ZERO = new BN(0);

import NoData from '../../../components/NoData';
import * as filters from '../../../filters/Index';
import i18n from './../../../plugins/i18n';

export default {
    name: 'Balance',
    data: () => ({
        headers: [{ text: i18n.tc('wallet.balance.date'), value: 'date', width: 200 }, { text: i18n.tc('wallet.balance.event'), value: 'content' }],
    }),
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance.isEqualTo(ZERO);
        },
        balance() {
            let list = [];
            for (let key in this.$store.state.balance_list){
                let item = this.$store.state.balance_list[key];
                if (item.value.isGreaterThan(ZERO)) {
                    list.push(item);
                }
            }
            return list;
        },
        reserved() {
            return this.$store.getters.reservedCall;
        },
        transactions() {
            let list = this.$store.state.transactions.slice(0,10);
            let address = this.$store.state.address;
            let result = [];
            for (let i = 0; i < list.length; ++i)
            {
                let tx = list[i];
                result.push({date: filters.humanDate(tx.outcome.timestamp), content: filters.txDesc(tx, address), type: tx.type, id: tx.id});
            }
            return result;
        }
    },
    async created() {
        let address = this.$store.state.address;
        let status = this.$store.getters.networkStatus;
        if (!status) {
            this.$store.commit('logout');
            return;
        }

        let api = this.$store.state.api;
        try {
            let ret = await api.getBalances(address);
            this.$store.commit("initBalance", ret);
            let result = await api.getTransactions(address, {limit: 10});
            this.$store.commit("initTransactions", result);
            let info = await api.getAccountInfo(address);
            this.$store.commit("initAccountInfo", info);
        } catch (e) {
            this.$toast.error(e.message);
            console.dir(e);
            if (e.message !== 'actNotFound') {
                this.$store.commit('logout');
            }
        }
    },
    methods: {
        rowClass(item) {
            return ''
        }
    }
}
</script>

<style scoped>

</style>