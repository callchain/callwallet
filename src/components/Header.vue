<template>
  <div style="background: #f9f9f9;">
    <v-hover v-slot:default="{ hover }">
    <v-card color="#f9f9f9" style="position: relative;" width="1200" class="mx-auto" flat>
      <div style="position: relative; max-width: 1200px; height: 100px; padding-top: 20px;" :class="!isLogin? 'd-flex mx-auto align-center justify-space-between':'d-flex mx-auto align-start justify-space-between'">
        <v-img max-width="120" @click="handleLoginClick" style="cursor: pointer;" src="../assets/logo.png"></v-img>
        <v-spacer></v-spacer>
        <v-btn v-if="!isLogin" @click="handleSetting" class="mr-1" dark color="black" icon>
            <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-card v-if="isLogin" color="#ffffff" :elevation="hover ? 6 : 2">
          <div style="width: 300px;" class="d-inline-flex align-center justify-space-between pt-2 pb-2 pl-2 pr-2">
            <span>{{username}}</span>
            <v-hover v-slot:default="{hover}">
              <span @click="handleLoginOut" style="cursor: pointer;" :class="hover? 'primary--text':'primary--text'">{{$t("header.logout")}}</span>
            </v-hover>
            
          </div>
          <v-divider></v-divider>
          <span class="d-block pl-2 pt-2 pb-2">{{balance}}</span>
        </v-card>
        <span v-if="isOffline" style="position: absolute; bottom: -55px; right: 0; width: 300px; line-height: 50px; text-align: center; z-index: 9999;" class="d-inline-block black white--text">{{$t("header.offline")}}</span>
      </div>
    </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  name: 'Header',

  data: () => ({
    // 是否登录
    offline: true
  }),
  created() {    
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin
    },
    isOffline() {
      return this.$store.state.isOffline
    },
    username() {
      return this.$store.state.username
    },
    balance() {
      var bal = this.$store.state.balance;
      var ret = this.balanceFormat(bal);
      return ret;
    }
  },
  methods: {
    balanceFormat(value) {
      if (!value) return 'Unfunded account';
      var str = '' + value;
      var intPart = Math.floor(Number(value));
      var pointPart = str.substring(str.lastIndexOf('.') === -1 ? str.length : str.lastIndexOf('.'));
      var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      return intPartFormat + pointPart + ' CALL';
    },
    handleLoginClick() {
    },
    /// do setting
    handleSetting() {
      this.$router.push({ path: '/options'})
    },
    /// do logout
    handleLoginOut() {
      this.$store.commit('logout');
    }
  }
}
</script>
