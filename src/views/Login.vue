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
              label=""
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
              label=""
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

    <v-dialog
      v-model="dialog"
      max-width="300"
    >
      <v-card>
        <v-card-title></v-card-title>
          <v-card-text class="text-center">{{warn_text}}</v-card-text>
            <v-card-actions class="d-flex align-center justify-center pb-5">
                <v-btn
                  color="primary"
                  @click="dialog=false"
                >
                  OK
                </v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>

  </v-card>
</template>

<script>
// @ is an alias to /src

import Blob from '../api/Blob';
import api from '../api/index';

export default {
  name: 'Login',
  components: {
    
  },
  data: () => ({
    walletName: '',
    passphrase: '',
    show1: false,
    canILogin: false,
    dialog: false,
    warn_text: ''
  }),
  methods: {
    /// 注册
    handleRegister() {
      this.$router.push('./register')
    },
    /// 登录
    handleLogin() {
      var data = Blob.decrypt(this.walletName, this.passphrase);
      if (typeof data === 'string') {
        this.warn_text = data;
        this.dialog = true;
        return;
      }

      sessionStorage.setItem("islogin", true);
      this.$store.commit('setblob', {blob: data, user: this.walletName});
      this.$store.commit('login');
      this.$router.push('./main');
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
