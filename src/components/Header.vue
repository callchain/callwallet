<template>
  <div style="background: #f9f9f9;">
    <v-card color="#f9f9f9" style="position: relative;" width="1200" class="mx-auto" flat>
      <div style="position: relative; max-width: 1200px; height: 100px; padding-top: 20px;" :class="!isSigned? 'd-flex mx-auto align-center justify-space-between':'d-flex mx-auto align-start justify-space-between'">
        <v-img max-width="120" @click="handleLoginClick" style="cursor: pointer;" src="../assets/logo.png"></v-img>
        <v-spacer></v-spacer>
        <v-btn v-if="!isSigned" @click="handleSetting" class="mr-1" dark color="black" icon>
            <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-card v-else color="#ffffff">
          <div style="width: 300px;" class="d-inline-flex align-center justify-space-between pt-2 pb-2 pl-2 pr-2">
            <span>1243sd</span>
            <v-hover v-slot:default="{hover}">
              <span @click="handleLoginOut" style="cursor: pointer;" :class="hover? 'primary--text':'primary--text'">LoginOut</span>
            </v-hover>
            
          </div>
          <v-divider></v-divider>
          <span class="d-block pl-2 pt-2 pb-2">4,123 Call</span>
          <v-divider></v-divider>
          <span class="d-block pl-2 pt-2 pb-2">Unfunded account</span>
        </v-card>
        <span style="position: absolute; bottom: -95px; right: 0; width: 300px; line-height: 50px; text-align: center" class="d-inline-block black white--text">Offline</span>
      </div>

      
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Header',

  data: () => ({
    // 是否登录
    isSigned: false
  }),
  created() {
    window.addEventListener('setItem', ()=> {
      // this.newVal = sessionStorage.getItem('watchStorage');
      if(sessionStorage.getItem('token')){
        this.isSigned = true;
      }
    })
    
  },
  methods: {
    handleLoginClick() {
      console.log('点击logo')
    },
    /// 点击设置图标
    handleSetting() {
      this.$router.push({ path: '/Trust', query: { index: 5 } })
    },
    /// 点击退出登录
    handleLoginOut() {
      sessionStorage.clear()
      this.isSigned = false
      this.$router.push('/login')
    }
  }
}
</script>
