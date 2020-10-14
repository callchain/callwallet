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
                        <div class="text-h4 text-center">{{item.value | numberFormat}}</div>
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
            ></v-data-table>
            <v-divider></v-divider>
            <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center">{{$t('wallet.balance.history')}}</v-btn>
        </div>
        </div>
    </v-card>
</template>
<script>

import NoData from '../../../components/NoData';
import * as filters from '../../../filters/Index';
import i18n from './../../../plugins/i18n';

export default {
    
    name: 'blance',
    data: () => ({
        headers: [{ text: i18n.tc('wallet.balance.date'), value: 'date', width: 200 }, { text: i18n.tc('wallet.balance.event'), value: 'content' }],
    }),
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance === 0
        },
        balance() {
            var list = [];
            for (var key in this.$store.state.balance_list){
                var item = this.$store.state.balance_list[key];
                if (Number(item.value) > 0) {
                    list.push(item);
                }
            }
            return list;
        },
        reserved() {
            return this.$store.getters.reservedCall;
        },
        transactions() {
            var list = this.$store.state.transactions.slice(0,10);
            var address = this.$store.state.address;
            var result = [];
            for (var i = 0; i < list.length; ++i)
            {
                var tx = list[i];
                result.push({date: filters.humanDate(tx.outcome.timestamp), content: filters.txDesc(tx, address), type: tx.type});
            }
            return result;
        }
    },
    async created() {
        var address = this.$store.state.address;
        var status = this.$store.getters.networkStatus;
        if (!status) {
            this.$store.commit('logout');
            return;
        }

        var api = this.$store.state.api;
        try {
            var height = this.$store.state.height;
            console.log('address=' + address + ', height=' + height);
            // , {ledgerVersion: Number(height)}
            var ret = await api.getBalances(address);
            this.$store.commit("initBalance", ret);
            var result = await api.getTransactions(address, {limit: 10});
            this.$store.commit("initTransactions", result);
            var info = await api.getAccountInfo(address);
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