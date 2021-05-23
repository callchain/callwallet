<template>
    <v-card flat class="pt-3 pl-3">
        <p class="text-h5">{{$t('wallet.security.sec1')}} <span class="font-weight-bold">{{$t('wallet.security.sec2')}}</span></p>
        <span class="d-block text-body-2">{{$t('wallet.security.sec3')}}</span>
        <span class="d-block text-body-2">{{$t('wallet.security.sec4')}}</span>
        <p class="font-weight-bold text-body-1 mt-5">{{$t('wallet.security.key')}}</p>
        <div v-if="!isShowKey">
            <span class="d-block text-body-2">- {{$t('wallet.security.warn1')}}</span>
            <span class="d-block text-body-2">- {{$t('wallet.security.warn2')}}</span>
            <span class="d-block text-body-2">- {{$t('wallet.security.warn3')}}</span>
            <span class="d-block text-body-2">- {{$t('wallet.security.warn4')}}</span>
        </div>
        <div v-else class="d-flex align-center">
            <input :type="isShow?'text':'password'" readonly :value="key" style="width: 400px">
            <v-btn outlined color="primary" @click="handleShowDialog" text>{{!isShow? $t('wallet.security.doshow') : $t('wallet.security.dohide')}}</v-btn>
        </div>
        <v-btn color="primary" @click="isShowKey = true" v-if="!isShowKey" class="mt-5">{{$t('wallet.security.show')}}</v-btn>

        <v-dialog
            v-model="dialog"
            max-width="600"
            >
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text class="text-center">{{$t('wallet.security.safewarn')}}</v-card-text>
                <v-card-actions class="d-flex align-center justify-center pb-5">
                    <v-btn
                        color="primary"
                        outlined
                        text
                        @click="dialog = false"
                    >
                        {{$t('wallet.security.no')}}
                    </v-btn>
                    <v-btn
                        color="primary"
                        @click="handleShowKey"
                    >
                        {{$t('wallet.security.yes')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
export default {
    name: 'Security',
    data: () => ({
        isShowKey: false,
        isShow: false,
        dialog: false,
        key: ''
    }),
    computed: {},
    created() {
        this.key = this.$store.state.blob.data.master_seed;
    },
    methods: {
        /// 显示dialog
        handleShowDialog() {
            if(!this.isShow){
                this.dialog = true
            } else {
                this.isShow = false;
            }
        },
        handleShowKey() {
            this.isShow = true;
            this.dialog = false;
        }
    }
}
</script>