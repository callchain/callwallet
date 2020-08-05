<template>
    <div class="main" style="min-height: 550px;">
        <p class="text-subtitle-1 font-weight-bold">You are sending {{issuer.currency}} to</p>
        <v-divider></v-divider>
        <p class="text-subtitle-1 font-weight-bold mt-2 mb-1">Recipient</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2"> {{recipient}}</div>
        <p class="mb-1">They will receive</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2">{{amount}} {{issuer.currency}}</div>
        <p>Are you sure?</p>
        <div class="d-flex">
            <v-btn width="100" @click="handleBack" outlined color="primary">Back</v-btn>
            <v-btn width="150" @click="handleConfirmed" class="ml-5" color="primary">Confirm</v-btn>
        </div>
    </div>
</template>
<script>

import api from '../../../api/index';

export default {
    name: 'receive',
    data: () => ({
        recipient: '',
        amount: '',
        issuer: '',
    }),
    created() {
        var params = this.$route.params;
        this.recipient = params.recipient;
        this.amount = params.amount;
        this.issuer = params.currency;
    },
    methods: {
        handleBack(){
            this.$router.go(-1);
        },
        async handleConfirmed() {
            // submit tx
            var blob = this.$store.state.blob;
            var from = blob.data.account_id;
            var secret = blob.data.master_seed;
            var send_amount = {value: this.amount, currency: this.issuer.currency, issuer: this.issuer.counterparty ? this.issuer.counterparty : ''};
            var payment = {
                source: {
                    address: from,
                    maxAmount: send_amount
                },
                destination: {
                    address: this.recipient,
                    amount: send_amount
                }
            };

            try {
                var prepare =  await api.preparePayment(from, payment);
                prepare.secret = secret;
                var signedTx = api.sign(prepare.tx_json, prepare.secret);
                var tx = await api.submit(signedTx, true);
                console.dir(tx);
                
                if (tx.resultCode !== 'tesSUCCESS')
                {
                    this.$toast.error('Fail tansaction: ' + tx.resultCode);
                    this.$router.go(-1);
                }
                else
                {
                    this.$toast.success('The transaction was applied. Only final in a validated ledger');
                    this.$router.push({name: 'submitted', params: {id: signedTx.id}});
                }
            } catch (e) {
                console.dir(e);
            }  
        }
    }
}
</script>