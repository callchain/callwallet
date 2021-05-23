<template>
    <div class="main ma-4" style="min-height: 550px;">
        <div>
            <div class="d-flex align-center justify-space-between mb-5">
                <span class="text-subtitle-1 font-weight-bold">{{$t('issue.touser.text')}}</span>
            </div>
            <v-divider></v-divider>

            <div>
                <div style="width: 35%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('issue.touser.recipient')}}</p>
                    <v-text-field
                        outlined
                        v-model="recipient"
                        label="Recipient address"
                        solo
                        flat
                        dense
                        @blur="checkAddress"
                    ></v-text-field>
                </div>
                <div style="width: 35%;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">{{$t('issue.touser.willreceive')}}</p>
                    <div class="d-inline-flex" style="width: 90%;">
                        <v-text-field
                            outlined
                            v-model="amount"
                            label="Amount"
                            type="number"
                            solo
                            flat
                            dense
                            @keydown="inputAmount"
                        ></v-text-field>
                        <span class="mt-2 ml-5">{{currentIssue.currency}}</span>
                    </div>
                </div>
                <!-- <div style="width: 300px;">
                    <p class="text-subtitle-1 font-weight-bold mb-2">Invoice ID</p>
                    <v-text-field
                        outlined
                        v-model="invoiceID"
                        label="Invoice ID"
                        solo
                        flat
                        dense
                    ></v-text-field>
                </div> -->
                <div class="">
                    <v-btn outlined color="primary" @click="goBack()" width="10%">&lt;&lt; {{$t('issue.touser.back')}}</v-btn>
                    <v-btn class="ml-5" color="primary" @click="confirmIssue()" width="15%" :disabled="canSend ? false : true">{{$t('issue.touser.confirm')}}</v-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import BN from 'bignumber.js';
const ZERO = new BN(0);
import utils from '../../../api/utils';

export default {
    name: 'issue-to-user',
    data: () => ({
        recipient: '',
        amount: '',
        invoiceID: '',

        currentIssue: {},
    }),
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        async confirmIssue() {
            // send token to user
            let blob = this.$store.state.blob;
            let from = blob.data.account_id;
            let issuer = from;
            let currency = this.currentIssue.currency;
            let secret = blob.data.master_seed;

            let send_amount = {
                value: this.amount, 
                currency: currency, 
                issuer: issuer
            };
            let payment = {
                source: {
                    address: from,
                    maxAmount: send_amount
                },
                destination: {
                    address: this.recipient,
                    amount: send_amount
                }
            };

            // check network status
            let status = this.$store.getters.networkStatus;
            if (!status) {
                this.$store.commit('logout');
                return;
            }

            let api = this.$store.state.api;
            try {
                let prepare =  await api.preparePayment(from, payment);
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
                    this.$router.push({name: 'issueToUserSubmitted', params: {id: signedTx.id}});
                }
            } catch (e) {
                this.$toast.error(e.message);
                console.dir(e);
                if (e.message !== 'actNotFound') {
                    this.$store.commit('logout');
                }
            } 
        },
        checkAddress() {
            if (!this.recipient || this.recipient === '') return;

            this.recipient = this.recipient.trim();
            if (!utils.isValidAddr(this.recipient)) {
                this.$toast.error("Recipient address is not valid Callchain address");
                this.$nextTick(() => {
                    this.recipient = '';
                });
            }
            let address = this.$store.state.address;
            if (this.recipient === address) {
                this.$toast.error("Cannot issue token to youself");
                this.$nextTick(() => {
                    this.recipient = '';
                });
            }
        },
        inputAmount(e) {
            if (e.key === '.') {
                this.$nextTick(() => {
                    this.amount = this.amount.replace(/\./g,'');
                })
            }
            if (e.key === '-') {
                this.$nextTick(() => {
                    this.amount = this.amount.replace(/-/g,'');
                })
            }
        }
    },
    components: {
    },
    computed: {
        canSend() {
            let address = this.$store.state.address;
            return utils.isValidAddr(this.recipient) && this.recipient !== address && Number(this.amount) > 0;
        }
    },
    created() {
        let params = this.$route.params;
        this.currentIssue = params;
        if (_.isEmpty(this.currentIssue) || !this.currentIssue.currency)
        {
            this.$router.push({name: 'issue'});
        }
    },
    watch: {
        amount(newv, oldv) {
            if (!this.amount || this.amount === '' || isNaN(this.amount)) return;

            let an = new BN(this.amount);
            if (an.isLessThanOrEqualTo(ZERO)) {
                this.$toast.error('Only postive number is allowed');
                this.$nextTick(() => {
                    this.amount = oldv;
                });
            }
            let left = new BN(this.currentIssue.total).minus(this.currentIssue.issued);
            if (an.isGreaterThan(left)) {
                this.$toast.error('Left issue quota for ' + this.currentIssue.currency + ' is ' + left);
                this.$nextTick(() => {
                    this.amount = oldv;
                });
            }
        }
    }
}
</script>