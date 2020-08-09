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
        ></v-data-table>
        <v-divider></v-divider>
        <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center" @click="loadMore">Load More</v-btn>
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
                    OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>
</template>
<script>

import NoData from '../../../components/NoData';
import * as filters from '../../../filters/Index';


export default {
    name: 'history',
    data: () => ({
        headers: [{ text: 'Date', value: 'date', width: 200 }, { text: 'Description', value: 'content' }],
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
            var list = this.$store.state.transactions;
            var address = this.$store.state.address;
            var result = [];
            for (var i = 0; i < list.length; ++i)
            {
                var tx = list[i];
                result.push({date: filters.humanDate(tx.outcome.timestamp), content: filters.txDesc(tx, address)});
            }
            return result;
        }
    },
    methods: {
        async loadMore() {
            var address = this.$store.state.address;
            var marker = this.$store.state.marker;

            if (_.isEmpty(marker)) {
                this.warn_text = 'No more data';
                this.dialog = true;
                return;
            }

            var api = this.$store.state.api;
            try {
                var result = await api.getTransactions(address, {limit: 10, marker: marker});
                this.$store.commit('updateTransactions', result);
            } catch (e) {
                this.$toast.error(e.message);
                console.dir(e);
                this.$store.commit('logout');
                this.$router.push("./login");
            }
        }
    }
}
</script>