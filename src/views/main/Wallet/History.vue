<template>
    <v-card flat>
        <NoData v-if="nofund"></NoData>
        <div v-if="!nofund">
        <v-data-table
            calculate-widths
            :headers="headers"
            :items="transactions"
            :items-per-page="-1"
            disable-sort
            hide-default-footer
        >
            <template v-slot:[`item.content`]="{item}">
                <a :href="'http://block.callchain.cc/#/transaction/' + item.id" target="_blank">{{item.content}}</a>
            </template>
        </v-data-table>
        <v-divider></v-divider>
        <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center" @click="loadMore">{{$t('wallet.history.loadmore')}}</v-btn>
        </div>

        <v-dialog v-model="dialog" max-width="300">
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text class="text-center">{{warn_text}}</v-card-text>
                <v-card-actions class="d-flex align-center justify-center pb-5">
                    <v-btn
                    color="primary"
                    @click="dialog=false"
                    >
                    {{$t('wallet.history.ok')}}
                    
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>
</template>
<script>

import NoData from '../../../components/NoData';
import * as filters from '../../../filters/Index';
import i18n from './../../../plugins/i18n';


export default {
    name: 'History',
    data: () => ({
        headers: [{ text: i18n.tc('wallet.history.date'), value: 'date', width: 200 }, { text: i18n.tc('wallet.history.desc'), value: 'content' }],
        dialog: false,
        warn_text: ''
    }),
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance === 0
        },
        transactions() {
            let list = this.$store.state.transactions;
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
    methods: {
        async loadMore() {
            let address = this.$store.state.address;
            let marker = this.$store.state.marker;

            if (_.isEmpty(marker)) {
                this.warn_text = 'No more data';
                this.dialog = true;
                return;
            }

            let api = this.$store.state.api;
            let status = this.$store.getters.networkStatus;
            if (!status) {
                this.$store.commit('logout');
                return;
            }
            try {
                let result = await api.getTransactions(address, {limit: 10, marker: marker});
                this.$store.commit('updateTransactions', result);
            } catch (e) {
                this.$toast.error(e.message);
                console.dir(e);
                if (e.message !== 'actNotFound') {
                    this.$store.commit('logout');
                }
            }
        }
    }
}
</script>