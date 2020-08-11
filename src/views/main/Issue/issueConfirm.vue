<template>
    <div class="main" style="min-height: 550px;">
        <p class="text-subtitle-1 font-weight-bold">You are issuing new token {{info.symbol}}</p>
        <v-divider></v-divider>
        <p class="text-subtitle-1 font-weight-bold mt-2 mb-1">Issue Supply</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2"> {{info.supply}}</div>
        <p class="mb-1">Issue Description</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2">{{info.desc}}</div>
        <p>Are you sure?</p>
        <div class="d-flex">
            <v-btn width="100" @click="handleBack" outlined color="primary">Back</v-btn>
            <v-btn width="150" @click="handleConfirmed" class="ml-5" color="primary">Confirm</v-btn>
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
        var params = this.$route.params;
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
            var blob = this.$store.state.blob;
            var from = blob.data.account_id;
            var secret = blob.data.master_seed;
            
            var issueSet = {
                total: {value: this.info.supply, currency: this.info.symbol, issuer: from},
                editable: false,
                nonFungible: false,
                transferRate: 0
            };

            // check network status
            var status = this.$store.getters.networkStatus;
            if (!status) {
                this.$store.commit('logout');
                return;
            }

            var api = this.$store.state.api;
            try {
                var prepare =  await api.prepareIssueSet(from, issueSet);
                prepare.secret = secret;
                var signedTx = api.sign(prepare.txJSON, prepare.secret);
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
                    this.$router.push({name: 'issueSubmitted', params: {id: signedTx.id}});
                }
            } catch (e) {
                this.$toast.error(e.message);
                console.dir(e);
                this.$store.commit('logout');
            }  
        }
    }
}
</script>