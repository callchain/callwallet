<template>
<v-card
    class="mx-auto"
    max-width="1200"
    outlined
    light
  >
  <div class="term">
    <div class="text-center text-h4 pt-6 pb-6">Term of Service</div>
    <v-divider></v-divider>
    <div style="width: 90%; margin-left: 5%; padding: 20px 0;">
      <p>Maecenas volutpat, odio eget imperdiet faucibus, dui diam placerat turpis, non semper leo quam fringilla orci. Etiam vitae fringilla leo. Cras mollis ex vel mauris ullamcorper porta. Proin est felis, venenatis sed ex sit amet, luctus dictum tellus. Etiam porttitor, felis facilisis feugiat egestas, mi ipsum varius tortor, vel varius lorem nulla non tortor. Nulla vel ligula vehicula, posuere erat imperdiet, consequat ante. Sed vestibulum, elit non interdum tempor, diam justo venenatis arcu, eget ullamcorper elit ex sed risus. Ut sagittis tincidunt lectus, id tempor felis auctor eu. Donec feugiat vehicula risus ut tristique.</p>
      <p>Maecenas volutpat, odio eget imperdiet faucibus, dui diam placerat turpis, non semper leo quam fringilla orci. Etiam vitae fringilla leo. Cras mollis ex vel mauris ullamcorper porta. Proin est felis, venenatis sed ex sit amet, luctus dictum tellus. Etiam porttitor, felis facilisis feugiat egestas, mi ipsum varius tortor, vel varius lorem nulla non tortor. Nulla vel ligula vehicula, posuere erat imperdiet, consequat ante. Sed vestibulum, elit non interdum tempor, diam justo venenatis arcu, eget ullamcorper elit ex sed risus. Ut sagittis tincidunt lectus, id tempor felis auctor eu. Donec feugiat vehicula risus ut tristique.</p>
      <p>Maecenas volutpat, odio eget imperdiet faucibus, dui diam placerat turpis, non semper leo quam fringilla orci. Etiam vitae fringilla leo. Cras mollis ex vel mauris ullamcorper porta. Proin est felis, venenatis sed ex sit amet, luctus dictum tellus. Etiam porttitor, felis facilisis feugiat egestas, mi ipsum varius tortor, vel varius lorem nulla non tortor. Nulla vel ligula vehicula, posuere erat imperdiet, consequat ante. Sed vestibulum, elit non interdum tempor, diam justo venenatis arcu, eget ullamcorper elit ex sed risus. Ut sagittis tincidunt lectus, id tempor felis auctor eu. Donec feugiat vehicula risus ut tristique.</p>
      <v-btn width="150" class="mb-5 mt-5" outlined color="primary" @click="handleBack">Back</v-btn>
    </div>
  </div>
</v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Welcome',
  data: () => ({
   
  }),
  methods: {
   // 点击已保存
   handleBack() {
       this.$router.go(-1)
   }
  },
}
</script>
