<template>
    <div class="main pa-8" style="min-height: 550px;">
        <p>This is your public address. Give this address to other users so they can send you money.</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2">{{address}}</div>
        <p>Tip: Select and copy using Ctrl+C (Win), Command+C (OSX).</p>
        <div class="qrcode" style="width: 250px; height: 250px;" ref="qrCodeUrl"></div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
    name: 'receive',
    data: () => ({
    }),
    mounted() {
        this.creatQrCode();
    },
    computed: {
        address() {
            return this.$store.state.address
        }
    },
    methods: {
        creatQrCode() {
            var text = this.$store.state.address;
            var qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: text,
                width: 250,
                height: 250,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
        },
    }
}
</script>