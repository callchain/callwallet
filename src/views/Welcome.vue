<template>
<v-card
    class="mx-auto"
    max-width="1200"
    outlined
    light
  >
  <div class="login">
    <div class="text-center text-h4 pt-6 pb-6">{{$t('welcome.title')}}</div>
    <v-divider></v-divider>
    <div style="width: 90%; margin-left: 5%; padding: 20px 0;">
      <p class="text-subtitle-1 font-weight-bold">{{$t('welcome.important')}}</p>
      <p class="text-subtitle-1">{{$t('welcome.important_info')}}</p>
      <p class="text-subtitle-1 font-weight-bold">{{$t('welcome.address')}}</p>
      <p class="text-subtitle-1">{{address}}</p>
      <p class="text-subtitle-1 font-weight-bold">{{$t('welcome.secret')}}</p>
      <div class="mb-3"><input :type="isShowKey?'text':'password'" readonly :value="key" style="float:left; width: 100%;"></div>
      <v-btn width="300" class="mb-5" small color="orange darken-1" @click="isShowKey = !isShowKey" depressed>{{isShowKey? $t('welcome.hide') : $t('welcome.show')}}{{$t('welcome.btn_text_part')}}</v-btn>
      <v-divider></v-divider>
      <p class="text-subtitle-1 font-weight-bold mt-5">{{$t('welcome.warn')}}</p>
      <v-btn width="400" class="mb-5" large color="primary" @click="handleSaved" depressed>{{$t('welcome.yes')}}</v-btn>
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
    let params = this.$route.params;
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
