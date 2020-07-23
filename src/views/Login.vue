<template>
  <v-card
    class="mx-auto"
    max-width="1200"
    outlined
    light
  >
    <div class="login">
      <div class="text-center text-h4 pt-6 pb-6">Open Wallet</div>
      <v-divider></v-divider>
      <div style="width: 90%; margin-left: 5%; padding: 20px 0;">
        <p class="text-subtitle-1">Enter the Name and Passphrase used to encrypt your Wallet below.</p>
        <div class="form-item" style="width: 400px;">
            <p class="font-weight-bold mb-1">Wallet name</p>
            <v-text-field
              outlined
              v-model="walletName"
              label="wallet name"
              solo
              flat
              dense
            ></v-text-field>
        </div>
        <div class="form-item" style="width: 400px;">
            <p class="font-weight-bold mb-1">Passphrase</p>
            <v-text-field
              outlined
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              v-model="passphrase"
              label="passphrase"
              solo
              flat
              dense
            ></v-text-field>
        </div>
        <v-btn @click="handleLogin" width="400" large color="primary" depressed :disabled="canILogin? false:true">Open Wallet</v-btn>
        <v-card-text style="padding-left: 0;">
          <span>New to Callchain? </span>
          <v-hover v-slot:default="{ hover }">
            <span @click="handleRegister" :class="hover ? 'primary--text text-decoration-underline': 'primary--text'" style="cursor: pointer">Create Wallet</span>
          </v-hover>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  components: {
    
  },
  data: () => ({
    walletName: '',
    passphrase: '',
    show1: false,
    canILogin: false
  }),
  methods: {
    /// 注册
    handleRegister() {
      this.$router.push('./register')
    },
    /// 登录
    handleLogin() {
      // sessionStorage.setItem('token', '23'),
      this.resetSetItem('token', 'asd');  /// 触发
      this.$router.push('./main')
    }
  },
  watch: {
    passphrase(a, b) {
      if(this.walletName != '' && this.passphrase != ''){
        this.canILogin = true
      } else {
        this.canILogin = false
      }
    },
    walletName(a, b) {
      if(this.walletName != '' && this.passphrase != ''){
        this.canILogin = true
      } else {
        this.canILogin = false
      }
    }
  }
}
</script>
