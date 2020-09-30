<template>
  <v-card
    class="mx-auto"
    max-width="1200"
    outlined
    light
  >
    <div class="login">
      <div class="text-center text-h4 pt-6 pb-6">{{$t('login.open_wallet')}}</div>
      <v-divider></v-divider>
      <div style="width: 90%; margin-left: 5%; padding: 20px 0;">
        <p class="text-subtitle-1">{{$t('login.login_label')}}</p>
        <div class="form-item" style="width: 45%;">
            <p class="font-weight-bold mb-1">{{$t('login.wallet_name')}}</p>
            <v-text-field
              outlined
              v-model="walletName"
              label=""
              solo
              flat
              dense
            ></v-text-field>
        </div>
        <div class="form-item" style="width: 45%;">
            <p class="font-weight-bold mb-1">{{$t('login.passphrase')}}</p>
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
        <v-btn @click="handleLogin" style="width: 45%;" large color="primary" depressed :disabled="canILogin? false:true">{{$t('login.open_wallet')}}</v-btn>
        <v-card-text style="padding-left: 0;">
          <span>{{$t('login.new_to_call')}}</span>
          <v-hover v-slot:default="{ hover }">
            <span @click="handleRegister" :class="hover ? 'primary--text text-decoration-underline': 'primary--text'" style="cursor: pointer">{{$t('login.create_wallet')}}</span>
          </v-hover>
        </v-card-text>
      </div>
    </div>

  </v-card>
</template>

<script>
// @ is an alias to /src

import Blob from '../api/Blob';
import CreateApi from '../api/index';

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
      var data = Blob.decrypt(this.walletName, this.passphrase);
      if (typeof data === 'string') {
        this.$toast.error(data);
        return;
      }

      this.$store.commit('setblob', {blob: data, user: this.walletName});
      this.$store.commit('login');
      this.$router.push('./main');
    },
    checkLogin() {
      if(this.walletName != '' && this.passphrase != ''){
        this.canILogin = true
      } else {
        this.canILogin = false
      }
    }
  },
  created() {
    // check connection
    var api = this.$store.state.api;
    var state = api.isConnected && api.isConnected();
    console.log('api connected?' + state);
    var self = this;
    if (!state) {
      var server = this.$store.state.server;
      api = CreateApi(server)
      api.connect().then(function() {
        self.$toast.success('Callchain Server Connected');
        self.$store.commit('online');
        self.$store.commit('initApi', api);
      }).catch(function(e) {
        self.$toast.success('fail to connect api: ' + e);
        self.$store.commit('offline');
        console.error(e);
      });
    }    
  },
  watch: {
    passphrase(a, b) {
      this.checkLogin();
    },
    walletName(a, b) {
      this.checkLogin();
    }
  }
}
</script>
