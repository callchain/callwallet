<template>
    <div>
        <NoData v-if="nofund"></NoData>
        <v-card flat style="position: relative;" v-if="!nofund">
            <v-btn style="position: absolute; right: 15px; top: 0;" @click="isShowAdd = true" color="primary" :disabled="isShowAdd? true: false">{{$t('advanced.trust.add')}}</v-btn>
            <div v-if="!isShowAdd">
                <v-data-table 
                    calculate-widths
                    :headers="headers"
                    :items="trustlines"
                    sort-by="calories"
                    disable-sort
                    :items-per-page="-1"
                    hide-default-footer>   
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                    </template>
                    <template v-slot:[`item.balance`]="{ item }">
                        {{item.balance | numberFormat}}
                    </template>
                    <template v-slot:[`item.limit`]="{ item }">
                        {{item.limit | numberFormat}}
                    </template>
                    </v-data-table>
                    <v-divider></v-divider>
                    <!-- <v-btn text style="cursor: pointer;" class="mb-5 mt-5 primary--text text-center">Load More</v-btn> -->
                </div>
            <div v-else class="add-edit ml-3 mt-1">
                <div style="width: 40%;">
                    <div class="text-subtitle-1 font-weight-bold">{{$t('advanced.trust.issuer')}}</div>
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
                    <div class="text-subtitle-1 font-weight-bold">{{$t('advanced.trust.token')}}</div>
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
                    <v-btn width="50%" @click="isShowAdd = false" outlined color="primary">&lt;&lt; {{$t('advanced.trust.back')}}</v-btn>
                    <v-btn width="50%" @click="handleAddConfirm" color="primary" class="ml-5" :disabled="!canTrust">{{$t('advanced.trust.trust')}}</v-btn>
                </div>
            </div>


            <v-dialog
                v-model="dialog"
                max-width="600"
                >
                <v-card>
                    <v-card-title></v-card-title>
                    <v-card-text class="text-center">{{$t('advanced.trust.sure')}}</v-card-text>
                    <v-card-actions class="d-flex align-center justify-center pb-5">
                        <v-btn
                            color="primary"
                            outlined
                            text
                            @click="dialog = false"
                        >
                            {{$t('advanced.trust.no')}}
                        </v-btn>
                        <v-btn
                            color="primary"
                            @click="handleDialogConfirm"
                        >
                            {{$t('advanced.trust.yes')}}
                            
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>
<script>
import BN from 'bignumber.js';
const ZERO = new BN(0);

import NoData from '../../../components/NoData';
import utils from '../../../api/utils';
import i18n from '../../../plugins/i18n'

export default {
    name: 'Trust',
    data: () => ({
        isShowAdd: false, /// 是否能点击添加按钮
        dialog: false, /// 是否显示弹窗
        headers: [
            { text: i18n.tc('advanced.trust.currency'), value: 'currency', sortable: false }, 
            { text: i18n.tc('advanced.trust.counterparty'), value: 'counterparty' }, 
            { text: i18n.tc('advanced.trust.limit'), value: 'limit' }, 
            { text: i18n.tc('advanced.trust.balance'), value: 'balance' }, 
            { text: i18n.tc('advanced.trust.actions'), value: 'actions', align: 'center', sortable: false }
        ],

        items: [],
        name: '',
        select: '', /// token
        items_map: {},

        currentItem: {}

    }),
    methods: {
        /// 确认新增
        async handleAddConfirm() {
            let from = this.$store.state.address;
            let currency = this.select;
            let issuer = this.name;
            let limit = this.items_map[currency].value;
            let secret = this.$store.state.blob.data.master_seed;
            let trustline = {
                currency: currency,
                counterparty: issuer,
                limit: limit,
                callingDisabled: true // to test
            };

            // check network status
            let status = this.$store.getters.networkStatus;
            if (!status) {
                this.$store.commit('logout');
                return;
            }

            let api = this.$store.state.api;
            try {
                let prepare = await api.prepareTrustline(from, trustline);
                prepare.secret = secret;
                let signedTx = api.sign(prepare.txJSON, prepare.secret);
                let tx = await api.submit(signedTx, true);
                
                if (tx.resultCode !== 'tesSUCCESS')
                {
                    this.$toast.error('Fail transaction: ' + tx.resultCode);
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
                if (e.message !== 'actNotFound') {
                    this.$store.commit('logout');
                }
            }

        },
        /// 显示弹窗删除
        deleteItem (item) {
            if (!item.balance.isEqualTo(ZERO)) {
                this.$toast.error("You hold " + item.currency + " with balance is " + item.balance.toFormat());
                return;
            }
            this.currentItem = item;
            this.dialog = true;
        },
        /// 确认删除
        async handleDialogConfirm() {
            let from = this.$store.state.address;
            let secret = this.$store.state.blob.data.master_seed;
            let trustline = {
                currency: this.currentItem.currency,
                counterparty: this.currentItem.counterparty,
                limit: '0',
                callingDisabled: false
            };

            // check network status
            let status = this.$store.getters.networkStatus;
            if (!status) {
                this.$store.commit('logout');
                return;
            }

            let api = this.$store.state.api;
            try {
                let prepare = await api.prepareTrustline(from, trustline);
                prepare.secret = secret;
                let signedTx = api.sign(prepare.txJSON, prepare.secret);
                let tx = await api.submit(signedTx, true);
                console.dir(tx);
                
                if (tx.resultCode !== 'tesSUCCESS')
                {
                    this.$toast.error('Fail transaction: ' + tx.resultCode);
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

            let address = this.$store.state.address;
            if (this.name === address) {
                if (!utils.isValidAddr(this.name)) {
                    this.$toast.error("Should not trust yourself");
                    this.$nextTick(() => {
                        this.name = '';
                    });
                    return;
                }
            }

            // check network status
            let status = this.$store.getters.networkStatus;
            if (!status) {
                this.$store.commit('logout');
                return;
            }

            // get account issues
            let api = this.$store.state.api;
            try {
                let issues = await api.getAccountIssues(this.name);
                this.items = [];
                this.items_map = {};
                for (let i = 0; i < issues.results.length; ++i) {
                    let issue = issues.results[i];
                    this.items.push(issue.specification.currency);
                    this.items_map[issue.specification.currency] = issue.specification;
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
    components: {
        NoData
    },
    computed: {
        nofund() {
            return this.$store.state.balance.isEqualTo(ZERO);
        },
        // convert obj to array
        trustlines() {
            let list = this.$store.state.trustlines;
            let result = [];
            for (let key in list) {
                let item = list[key];
                result.push(item);
            }
            return result;
        },
        canTrust() {
            return this.name && utils.isValidAddr(this.name)
                && this.select && this.select !== '';
        }
    },
    async created() {
        this.isShowAdd = false;

        // check network status
        let status = this.$store.getters.networkStatus;
        if (!status) {
            this.$store.commit('logout');
            return;
        }

        let api = this.$store.state.api;
        try {
            let address = this.$store.state.address;
            let lines = await api.getTrustlines(address);
            this.$store.commit("initTrustlines", lines);
        } catch (e) {
            this.$toast.error(e.message);
            console.dir(e);
            if (e.message !== 'actNotFound') {
                this.$store.commit('logout');
            }
        }  
    }
}
</script>