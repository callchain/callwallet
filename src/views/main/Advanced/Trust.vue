<template>
    <div>
        <NoData v-if="nofund"></NoData>
        <v-card flat style="position: relative;" v-if="!nofund">
            <v-btn style="position: absolute; right: 15px; top: 0;" @click="isShowAdd = true" color="primary" :disabled="isShowAdd? true: false">Add Trust</v-btn>
            <div v-if="!isShowAdd">
                <v-data-table 
                    calculate-widths
                    :headers="headers"
                    :items="trustlines"
                    sort-by="calories"
                    :items-per-page="10"
                    hide-default-footer>   
                    <template v-slot:item.actions="{ item }">
                        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                    </template>
                    </v-data-table>
                    <v-divider></v-divider>
                    <!-- <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center">Load More</v-btn> -->
                </div>
            <div v-else class="add-edit ml-3 mt-1">
                <div style="width: 40%;">
                    <div class="text-subtitle-1 font-weight-bold">Issuer Callchain address</div>
                    <v-text-field
                    outlined
                    v-model="name"
                    label="Callchain address"
                    solo
                    flat
                    dense
                    @blur="checkName"
                    ></v-text-field>
                </div>
                <div style="width: 40%;">
                    <div class="text-subtitle-1 font-weight-bold">Token</div>
                    <v-select
                        v-model="select"
                        :items="items"
                        item-color="primary"
                        dense
                        outlined
                        @change="handleBlur"
                    ></v-select>
                </div>
                
                <div class="d-inline-flex align-center">
                    <v-btn width="40%" @click="isShowAdd = false" outlined color="primary">Cancel</v-btn>
                    <v-btn width="60%" @click="handleAddConfirm" color="primary" class="ml-5" :disabled="!canTrust">Trust</v-btn>
                </div>
            </div>


            <v-dialog
                v-model="dialog"
                max-width="600"
                >
                <v-card>
                    <v-card-title></v-card-title>
                    <v-card-text class="text-center">Are you want to delete this item?</v-card-text>
                    <v-card-actions class="d-flex align-center justify-center pb-5">
                        <v-btn
                            color="primary"
                            outlined
                            text
                            @click="dialog = false"
                        >
                            No
                        </v-btn>
                        <v-btn
                            color="primary"
                            @click="handleDialogConfirm"
                        >
                            Yes, delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>
<script>

import NoData from '../../../components/NoData';
import utils from '../../../api/utils';

export default {
    name: 'contacts',
    data: () => ({
        isShowAdd: false, /// 是否能点击添加按钮
        dialog: false, /// 是否显示弹窗
        headers: [
            { text: 'Currency', value: 'currency', sortable: false }, 
            { text: 'Counterparty', value: 'counterparty' }, 
            { text: 'Limit', value: 'limit' }, 
            { text: 'Balance', value: 'balance' }, 
            { text: 'Actions', value: 'actions', align: 'center', sortable: false }
        ],

        items: [],
        name: '',
        select: '', /// token
        items_map: {},

        currentItem: {}

    }),
    created() {
        this.isShowAdd = false;
    },
    methods: {
        /// 确认新增
        async handleAddConfirm() {
            var from = this.$store.state.address;
            var currency = this.select;
            var issuer = this.name;
            var limit = this.items_map[currency].value;
            var secret = this.$store.state.blob.data.master_seed;
            var trustline = {
                currency: currency,
                counterparty: issuer,
                limit: limit,
                callingDisabled: true // to test
            };

            var api = this.$store.state.api;
            try {
                var prepare = await api.prepareTrustline(from, trustline);
                console.dir(prepare);
                prepare.secret = secret;
                var signedTx = api.sign(prepare.txJSON, prepare.secret);
                console.dir(signedTx);
                var tx = await api.submit(signedTx, true);
                console.dir(tx);
                
                if (tx.resultCode !== 'tesSUCCESS')
                {
                    this.$toast.error('Fail tansaction: ' + tx.resultCode);
                }
                else
                {
                    this.$toast.success('The transaction was applied. Only final in a validated ledger');
                    this.isShowAdd = false;
                    // re pull list or from transactions
                }
            } catch (e) {
                this.$toast.error(e.message);
                console.dir(e);
                this.$store.commit('logout');
                this.$router.push("./login");
            }

        },
        /// 显示弹窗删除
        deleteItem (item) {
            console.dir(item);
            if (Number(item.balance) !== 0) {
                this.$toast.error("You hold " + item.currency + " with balance is " + item.balance);
                return;
            }
            this.currentItem = item;
            this.dialog = true;
        },
        /// 确认删除
        async handleDialogConfirm() {
            var from = this.$store.state.address;
            var secret = this.$store.state.blob.data.master_seed;
            var trustline = {
                currency: this.currentItem.currency,
                counterparty: this.currentItem.counterparty,
                limit: '0',
                callingDisabled: false
            };

            var api = this.$store.state.api;
            try {
                var prepare = await api.prepareTrustline(from, trustline);
                console.dir(prepare);
                prepare.secret = secret;
                var signedTx = api.sign(prepare.txJSON, prepare.secret);
                console.dir(signedTx);
                var tx = await api.submit(signedTx, true);
                console.dir(tx);
                
                if (tx.resultCode !== 'tesSUCCESS')
                {
                    this.$toast.error('Fail tansaction: ' + tx.resultCode);
                }
                else
                {
                    this.$toast.success('The transaction was applied. Only final in a validated ledger');
                    // re pull list or from transactions
                }
            } catch (e) {
                this.$toast.error(e.message);
                console.dir(e);
                this.$store.commit('logout');
                this.$router.push("./login");
            }

            this.dialog = false;
            
        },
         /// 下拉框输入
        handleBlur() {
        },
        async checkName() {
            if (!this.name || this.name === '') return;

            this.name = this.name.trim();
            if (!utils.isValidAddr(this.name)) {
                this.$toast.error("Invalid Callchain address");
                this.$nextTick(() => {
                    this.name = '';
                });
                return;
            }

            var address = this.$store.state.address;
            if (this.name === address) {
                if (!utils.isValidAddr(this.name)) {
                    this.$toast.error("Should not trust yourself");
                    this.$nextTick(() => {
                        this.name = '';
                    });
                    return;
                }
            }

            // get account issues
            var api = this.$store.state.api;
            try {
                var issues = await api.getAccountIssues(this.name);
                this.items = [];
                this.items_map = {};
                for (var i = 0; i < issues.lines.length; ++i) {
                    var issue = issues.lines[i];
                    this.items.push(issue.Total.currency);
                    this.items_map[issue.Total.currency] = issue.Total;
                }
            } catch (e) {
                this.$toast.error(e.message);
                console.dir(e);
                this.$store.commit('logout');
                this.$router.push("./login");
            }
        }

    },
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance === 0
        },
        trustlines() {
            return this.$store.state.trustlines;
        },
        canTrust() {
            return this.name && utils.isValidAddr(this.name)
                && this.select && this.select !== '';
        }
    },
    async created() {
        var api = this.$store.state.api;
        try {
            var address = this.$store.state.address;
            var lines = await api.getTrustlines(address);
            this.$store.commit("initTrustlines", lines);
        } catch (e) {
            this.$toast.error(e.message);
            console.dir(e);
            this.$store.commit('logout');
            this.$router.push("./login");
        }
    }
}
</script>