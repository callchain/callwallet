<template>
    <div class="main mt-4" style="min-height: 550px;">
        <p class="text-subtitle-1 font-weight-bold">{{$t('issue.confirm.text')}} {{info.symbol}}</p>
        <v-divider></v-divider>
        <p class="text-subtitle-1 font-weight-bold mt-2 mb-1">{{$t('issue.confirm.supply')}}</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2"> {{info.supply}}</div>
        <p class="mb-1">{{$t('issue.confirm.desc')}}</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2">{{info.desc}}</div>
        <p>{{$t('issue.confirm.sure')}}</p>
        <div class="d-flex">
            <v-btn width="100" @click="handleBack" outlined color="primary">&lt;&lt; {{$t('issue.confirm.back')}}</v-btn>
            <v-btn width="150" @click="handleConfirmed" class="ml-5" color="primary">{{$t('issue.confirm.confirm')}}</v-btn>
        </div>
    </div>
</template>
<script>

export default {
    name: 'issue-confirm',
    data: () => ({
        info: {}
    }),
    created() {
        let params = this.$route.params;
        this.info = params;
        if (_.isEmpty(this.info) || !this.info.symbol || !this.info.supply) {
            this.$router.push({name: 'issue'});
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
            
            let issueSet = {
                total: {value: this.info.supply, currency: this.info.symbol, issuer: from},
                editable: false,
                nonFungible: false,
                transferRate: 0
            };

            // check network status
            let status = this.$store.getters.networkStatus;
            if (!status) {
                this.$store.commit('logout');
                return;
            }

            let api = this.$store.state.api;
            try {
                let prepare =  await api.prepareIssueSet(from, issueSet);
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
                    this.$router.push({name: 'issueSubmitted', params: {id: signedTx.id}});
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