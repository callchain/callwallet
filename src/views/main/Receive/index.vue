<template>
    <div class="main pa-8" style="min-height: 550px;">
        <p>This is your public address. Give this address to other users so they can send you money.</p>
        <div style="line-height: 60px; background: rgba(211, 2, 2, .1)" class="text-h5 mb-2 pl-2">cBhNRiWfJAd8mfiVTCcHCueJAL9pJhN5Nf</div>
        <p>Tip: Select and copy using Ctrl+C (Win), Command+C (OSX).</p>
        <div class="qrcode" style="width: 250px; height: 250px;" ref="qrCodeUrl"></div>
    </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
    name: 'receive',
    data: () => ({
        url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3381390367,3810581293&fm=26&gp=0.jpg'
    }),
    mounted() {
        this.creatQrCode();
    },
    methods: {
        creatQrCode() {
            var qrcode = new QRCode(this.$refs.qrCodeUrl, {
                text: this.url, // 需要转换为二维码的内容
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