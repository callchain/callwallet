<template>
    <div class="main" style="min-height: 550px;">
        <p class="text-h4">Your transaction has been submitted.</p>
        <p>Transaction Hash: {{hash}}</p>
        <p>Your account balance wil update once the payment has cleared.</p>
        <v-divider></v-divider>
        <v-hover v-slot:default="{ hover }">
            <div @click="handResend" :class="hover? 'primary--text mt-2':'primary--text mt-2 text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">Send another payment</div>
        </v-hover>
        <div></div>
        <v-hover v-slot:default="{ hover }">
            <div @click="handleBackBlance" :class="hover? 'primary--text':'primary--text text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">Back to balance</div>
        </v-hover>
    </div>
</template>
<script>
export default {
    name: 'send-submitted',
    data: () => ({
        hash: ''
    }),
    created() {
        var params = this.$route.params;
        if (_.isEmpty(params.id)) {
            this.$router.push('./send')
        } else {
            this.hash = params.id
        }
    },
    methods: {
        // 重发
        handResend(){
            this.$router.push('./send')
        },
        // 返回balance
        handleBackBlance() {
            this.$router.push('./balance')
        }
    }
}
</script>