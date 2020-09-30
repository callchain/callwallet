<template>
    <div class="main" style="min-height: 550px;">
        <p class="text-h4">{{$t('send.submitted.submitted')}}</p>
        <p>{{$t('send.submitted.hash')}} {{hash}}</p>
        <p>{{$t('send.submitted.balance')}}</p>
        <v-divider></v-divider>
        <v-hover v-slot:default="{ hover }">
            <div @click="handResend" :class="hover? 'primary--text mt-2':'primary--text mt-2 text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">{{$t('send.submitted.another')}}</div>
        </v-hover>
        <div></div>
        <v-hover v-slot:default="{ hover }">
            <div @click="handleBackBlance" :class="hover? 'primary--text':'primary--text text-decoration-underline'" style="display: inline-block; cursor: pointer; line-height: 40px;">{{$t('send.submitted.back')}}</div>
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