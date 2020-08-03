<template>
    <v-card flat class="pt-3 pl-3">
        <p class="text-h5">Your money and wallet are protected digitally through encryption algorithms that can be unlocked <span class="font-weight-bold">only with your personal keys</span></p>
        <span class="d-block text-body-2">No one else has them, so don't lose them!</span>
        <span class="d-block text-body-2">Never share them!</span>
        <p class="font-weight-bold text-body-1 mt-5">Secret Key</p>
        <div v-if="!isShowKey">
            <span class="d-block text-body-2">- This key is for emergency use only. You did not choose it. The network created it. You don't have to memorize it.</span>
            <span class="d-block text-body-2">- The Secret Key accesses Your money, which is already contained inside your wallet.</span>
            <span class="d-block text-body-2">- But if you ever lose your wallet, you can recover just your money with this key.</span>
            <span class="d-block text-body-2">- Store it somewhere safe, never share it.</span>
        </div>
        <div v-else class="d-flex align-center">
            <input :type="isShow?'text':'password'" readonly :value="key" style="width: 400px">
            <v-btn outlined color="primary" @click="handleShowDialog" text>{{!isShow?'Show':'Hide'}}</v-btn>
        </div>
        <v-btn color="primary" @click="isShowKey = true" v-if="!isShowKey" class="mt-5">Show my key</v-btn>

        <v-dialog
            v-model="dialog"
            max-width="600"
            >
            <v-card>
                <v-card-title></v-card-title>
                <v-card-text class="text-center">Are you in a safe place, where no person, or camera can see your screen?</v-card-text>
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
                        @click="handleShowKey"
                    >
                        Yes,Show Me
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
export default {
    name: 'security',
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