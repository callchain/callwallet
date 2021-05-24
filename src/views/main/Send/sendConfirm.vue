<template>
    <div class="main" style="min-height: 550px;">
        <p class="text-subtitle-1 font-weight-bold">{{$t('send.confirm.sending')}} {{issuer.currency}} {{$t('send.confirm.to')}}</p>
        <v-divider></v-divider>
        <p class="text-subtitle-1 font-weight-bold mt-2 mb-1">{{$t('send.confirm.recipient')}}</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2"> {{recipient}}</div>
        <p class="mb-1">{{$t('send.confirm.receive')}}</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2">{{amount}} {{issuer.currency}}</div>
        <p class="mb-1" v-if="memo.length !== 0">{{$t('send.confirm.with')}}</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2" v-if="memo.length !== 0">{{memo}}</div>
        <p>{{$t('send.confirm.sure')}}</p>
        <div class="d-flex">
            <v-btn width="100" @click="handleBack" outlined color="primary">&lt;&lt; {{$t('send.confirm.back')}}</v-btn>
            <v-btn width="150" @click="handleConfirmed" class="ml-5" color="primary">{{$t('send.confirm.confirm')}}</v-btn>
        </div>
    </div>
</template>
<script>

export default {
    name: 'SendConfirm',
    data: () => ({
        recipient: '',
        amount: '',
        issuer: '',
        memo: '',
    }),
    created() {
        let params = this.$route.params;
        this.recipient = params.recipient;
        this.amount = params.amount;
        this.issuer = params.currency;
        this.memo = params.memo;
        if (!this.recipient || !this.amount || !this.issuer) {
            this.$router.push({name: 'send'});
        }
    },
    methods: {
        handleBack(){
            this.$router.go(-1);
        },
        async handleConfirmed() {
            // submit tx
            let blob = this.$store.state.blob;
            let from = blob.data.account_id;
            let secret = blob.data.master_seed;
            let send_amount = {
                value: this.amount, 
                currency: this.issuer.currency, 
                issuer: this.issuer.counterparty ? this.issuer.counterparty : ''
            };
            let payment = {
                source: {
                    address: from,
                    maxAmount: send_amount
                },
                destination: {
                    address: this.recipient,
                    amount: send_amount
                },
                memos: []
            };
            if (this.memo.length !== 0) {
                payment.memos = [{
                    type: 'string',
                    data: this.memo
                }];
            }

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
                    this.$router.go(-1);
                }
                else
                {
                    this.$toast.success('The transaction was applied. Only final in a validated ledger');
                    this.$router.push({name: 'submitted', params: {id: signedTx.id}});
                }
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