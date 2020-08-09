<template>
<v-card
    class="mx-auto"
    max-width="1200"
    outlined
    light
  >
  <div class="login">
    <div class="text-center text-h4 pt-6 pb-6">Welcome to Callchain</div>
    <v-divider></v-divider>
    <div style="width: 90%; margin-left: 5%; padding: 20px 0;">
      <p class="text-subtitle-1 font-weight-bold">Important:</p>
      <p class="text-subtitle-1">The Secret Account Key below gives access to your money in the unlikely case that you lose your wallet name or passphrase. In that case your contacts will be lost, but with this Secret Account Key alone anyone can retrieve your money. So please store it somewhere PRIVATE AND SAFE.</p>
      <p class="text-subtitle-1 font-weight-bold">Callchain Address:</p>
      <p class="text-subtitle-1">{{address}}</p>
      <p class="text-subtitle-1 font-weight-bold">Secret Account key:</p>
      <div class="mb-3"><input :type="isShowKey?'text':'password'" readonly :value="key"></div>
      <v-btn width="300" class="mb-5" small color="orange darken-1" @click="isShowKey = !isShowKey" depressed>{{isShowKey?'Hide':'Show'}} secret account key</v-btn>
      <v-divider></v-divider>
      <p class="text-subtitle-1 font-weight-bold mt-5">Have you saved your Secret Account Key somewhere safe?</p>
      <v-btn width="400" class="mb-5" large color="primary" @click="handleSaved" depressed>Yes, I saved my secret account key</v-btn>
    </div>
  </div>
</v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Welcome',
  data: () => ({
    address: '',
    key: '',
    isShowKey: false
  }),
  created() {
    var params = this.$route.params;
    this.address = params.address;
    this.key = params.secret;
  },
  methods: {
   // 点击已保存
   handleSaved() {
       this.$router.push('/login')
   }
  },
}
</script>
